import { Component, inject, input, Input, OnInit, SimpleChanges } from '@angular/core';
import { ExpenseServiceService } from '../../../services/expense.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Expense, { ExpenseFilters } from '../../../models/expense';
import { FormsModule } from '@angular/forms';
import { PeriodSelectComponent } from '../../selects/period-select/period-select.component';
import Period from '../../../models/period';
import { CommonModule } from '@angular/common';
import { PeriodService } from '../../../services/period.service';
import { LotsService } from '../../../services/lots.service';
import Lot from '../../../models/lot';
import { BillService } from '../../../services/bill.service';
import BillType from '../../../models/billType';
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {NgPipesModule} from "ngx-pipes";
import {TableColumn, TableComponent} from "ngx-dabd-grupo01";
import {delay, Observable, of} from "rxjs";

@Component({
  selector: 'app-expenses-list',
  standalone: true,
  imports: [ CommonModule ,RouterModule, FormsModule, PeriodSelectComponent, TableComponent,NgPipesModule],
  templateUrl: './expenses-list.component.html',
  styleUrl: './expenses-list.component.css'
})
export class ExpensesListComponent implements OnInit{






showInfo() {
throw new Error('Method not implemented.');
}





onFilterTextBoxChanged($event: Event) {
throw new Error('Method not implemented.');
}
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly periodService = inject(PeriodService)
  private readonly lotsService = inject(LotsService)
  private readonly service = inject(ExpenseServiceService)
  private readonly billService = inject(BillService)

  selectedLotId: number = 0;
  selectedTypeId: number = 0;
  selectedPeriodId: number = 0;


  searchTerm = '';
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


  text : string = ""

  fileName : string = "Expensas.xlsx"


  applyFilterWithNumber: boolean = false;
  applyFilterWithCombo: boolean = false;
  contentForFilterCombo : string[] = []
  actualFilter : string | undefined = ExpenseFilters.NOTHING;
  filterTypes = ExpenseFilters;
  filterInput : string = "";


  ngOnInit(): void {
    this.currentPage = 0
    this.loadSelect()
    this.loadExpenses()
  }

  loadExpenses(page: number = 0, size: number = 10): void {
    this.service.getExpenses(page, size, this.selectedPeriodId, this.selectedLotId,this.selectedTypeId,this.sortField, this.sortOrder).subscribe(data => {
      this.expenses = data.content.map(expense => {
        const expenses = this.keysToCamel(expense) as Expense;
        return {
          ...expenses,
          month: this.getMonthName(expense.period.month), // Suponiendo que cada expenses-list tenga un campo `month`
        };

      });
      this.totalPages = data.totalPages;  // Número total de páginas
      this.totalItems = data.totalElements;  // Total de registros
      this.currentPage = data.number;
      this.updateVisiblePages();
    });
  }

  onPageSizeChange() {
    this.currentPage = 0; // Reinicia a la primera página
    console.log(this.pageSize)
    this.loadExpenses(0,this.pageSize);
  }
  applyFilters() {
    this.currentPage = 0
    this.loadExpenses();
    this.updateVisiblePages();
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
      this.currentPage = page;
  }
}

  toCamel(s: string) {
    return s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  }

  keysToCamel(o: any): any {
    if (o === Object(o) && !Array.isArray(o) && typeof o !== 'function') {
      const n: {[key: string]: any} = {};       Object.keys(o).forEach((k) => {
        n[this.toCamel(k)] = this.keysToCamel(o[k]);
      });       return n;
    } else if (Array.isArray(o)) {
      return o.map((i) => {         return this.keysToCamel(i);       });
    }     return o;
  }
  clearFilters() {
    this.selectedLotId = 0;
    this.selectedTypeId = 0;
    this.selectedPeriodId = 0;
    this.currentPage = 0
    this.loadExpenses();
    this.searchTerm = ''
    this.pageSize = 10
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
    return monthNames[month - 1];
  }
  imprimir() {
    console.log('Imprimiendo')
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.text('Expenses Report', 14, 20);

    // Llamada al servicio para obtener las expensas
    this.service.getWithoutFilters(this.selectedPeriodId, this.selectedLotId, this.selectedTypeId).subscribe(expenses => {
      // Usando autoTable para agregar la tabla
      autoTable(doc, {
        startY: 30,
        head: [['Mes', 'Año', 'Total Amount', 'State', 'Plot Number', 'Percentage', 'Bill Type']],
        body: expenses.map(expense => [
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
    this.service.getWithoutFilters( this.selectedPeriodId, this.selectedLotId, this.selectedTypeId).subscribe(expenses => {
      // Mapear los datos a un formato tabular adecuado
      const data = expenses.map(expense => ({
        'Periodo':  `${expense?.period?.month} / ${expense?.period?.year}`,
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
