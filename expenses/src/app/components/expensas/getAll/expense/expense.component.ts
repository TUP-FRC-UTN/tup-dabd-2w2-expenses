import { Component, inject, input, Input, OnInit, SimpleChanges } from '@angular/core';
import { ExpenseServiceService } from '../../../../services/expense.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Expense from '../../../../models/expense';
import { FormsModule } from '@angular/forms';
import { PeriodSelectComponent } from '../../../selects/period-select/period-select.component';
import { forkJoin } from 'rxjs';
import Period from '../../../../models/period';
import { Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodService } from '../../../../services/period.service';
import { LotsService } from '../../../../services/lots.service';
import Lot from '../../../../models/lot';
import Category from '../../../../models/category';
import { CategoryService } from '../../../../services/category.service';
import { BillService } from '../../../../services/bill.service';
import BillType from '../../../../models/billType';
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [ CommonModule ,RouterModule, FormsModule, PeriodSelectComponent],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent implements OnInit{
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute); 

  private readonly periodService = inject(PeriodService)
  private readonly lotsService = inject(LotsService)
  private readonly service = inject(ExpenseServiceService)
  private readonly billService = inject(BillService)

  selectedLotId: number = 0;
  selectedTypeId: number = 0;
  selectedPeriodId: number = 0;


  sortField: string = 'lotId';
  sortOrder: string = 'asc';

  expenses: Expense[] = []
  lots : Lot[] = []
  tipos: BillType[] = []
  periodos : Period[] = []

  totalElements: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;
  visiblePages: number[] = [];
  maxPagesToShow: number = 5;

  periodId : number | null = null
  lotId : number | null = null
  typeId : number | null = null
  

  fileName : string = "Expensas.xlsx"

  ngOnInit(): void {
    this.currentPage = 0
    this.loadExpenses();
    this.loadSelect()
    this.updateVisiblePages();
  }

  loadExpenses(page: number = 0, size: number = 10): void {
    this.service.getExpenses(page, size, this.selectedPeriodId, this.selectedLotId,this.selectedTypeId,this.sortField, this.sortOrder).subscribe(data => {
      this.expenses = data.content;
      this.totalPages = data.totalPages;  // Número total de páginas
      this.totalItems = data.totalElements;  // Total de registros
      this.currentPage = data.number; 
    });
    this.updateVisiblePages();
  }

 
  onPageSizeChange() {
  this.currentPage = 0; // Reinicia a la primera página
  console.log(this.pageSize)
  this.loadExpenses(0,this.pageSize);   
    }
  applyFilters() {
  throw new Error('Method not implemented.');
    }


  updateVisiblePages(): void {
    const half = Math.floor(this.maxPagesToShow / 2);
    let start = Math.max(0, this.currentPage - half);
    let end = Math.min(this.totalPages, start + this.maxPagesToShow);

    if (end - start < this.maxPagesToShow) {
      start = Math.max(0, end - this.maxPagesToShow);
    }

    this.visiblePages = [];
    for (let i = start; i < end; i++) {
      this.visiblePages.push(i);
    }
  }

  onPageChange(page: number): void {
    console.log(this.totalPages)
    if (page >= 0 && page < this.totalPages) {
    
      console.log('Cargando página ' + page);
      this.loadExpenses(page, this.pageSize);
      this.updateVisiblePages();
      this.currentPage = page; // Asegúrate de actualizar currentPage aquí
  }
}
  onOptionChange() {
    this.currentPage = 0
    this.loadExpenses();
    this.updateVisiblePages();
  }

  clearFilters() {
    this.selectedLotId = 0;
    this.selectedTypeId = 0;
    this.selectedPeriodId = 0;
    this.currentPage = 0
    this.loadExpenses();
  }
  //carga el select de periodo y lote
  loadSelect() {
    this.periodService.get().subscribe((data: Period[]) => {
      this.periodos = data
    })
    this.lotsService.get().subscribe((data: Lot[]) => {
      this.lots = data;
    })
    this.billService.getBillTypes().subscribe((data: BillType[]) => {
      this.tipos = data
    })
  }
  getMonthName(month: number): string {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return monthNames[month - 1]; // Ajuste para índice cero
  }
  imprimir() {
    console.log('Imprimiendo')
    const doc = new jsPDF();
    
    // Título del PDF
    doc.setFontSize(18);
    doc.text('Expenses Report', 14, 20);

    // Llamada al servicio para obtener las expensas
    this.service.getExpenses(0, 100000, this.selectedPeriodId, this.selectedLotId, this.selectedTypeId).subscribe(expenses => {
      // Usando autoTable para agregar la tabla
      autoTable(doc, {
        startY: 30,
        head: [['Mes', 'Año', 'Total Amount', 'State', 'Plot Number', 'Percentage', 'Bill Type']],
        body: expenses.content.map(expense => [
          expense.period.month,
          expense.period.year,
          expense.totalAmount,
          expense.state,
          expense.plotNumber,
          expense.percentage,
          expense.billType
        ]),
      });

      // Guardar el PDF después de agregar la tabla
      doc.save('expenses_report.pdf');
      console.log('Impreso')
    });
  }
     
  downloadTable() {
    this.service.getExpenses(0, 100000, this.selectedPeriodId, this.selectedLotId, this.selectedTypeId).subscribe(expenses => {
      // Mapear los datos a un formato tabular adecuado
      const data = expenses.content.map(expense => ({
        'Periodo':  `${expense.period.month} / ${expense.period.year}`,
        'Monto Total': expense.totalAmount,
        'Fecha de liquidación': expense.liquidationDate,
        'Estado': expense.state,
        'Número de lote': expense.plotNumber,
        'Typo de lote': expense.typePlot,
        'Porcentaje': expense.percentage,
        'Tipo de expensa': expense.billType
      }));
  
      // Convertir los datos tabulares a una hoja de cálculo
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
      XLSX.writeFile(wb, this.fileName);
    })}
}
