import { Component, inject, OnInit } from '@angular/core';
import { Charge } from '../../../models/charge';
import { ChargeService } from '../../../services/charge.service';
import { CategoryCharge } from '../../../models/charge';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateChargeComponent } from '../update-charge/update-charge.component';
import { CommonModule } from '@angular/common';
import { PeriodSelectComponent } from '../../selects/period-select/period-select.component';
import Lot from '../../../models/lot';
import { LotsService } from '../../../services/lots.service';
import { PeriodService } from '../../../services/period.service';
import { BorrarItemComponent } from '../../modals/borrar-item/borrar-item.component';
import { ExpensesChargesNavComponent } from '../../navs/expenses-charges-nav/expenses-charges-nav.component';
import { ExpensesBillsNavComponent } from '../../navs/expenses-bills-nav/expenses-bills-nav.component';
import $ from "jquery";
import { FormGroup } from '@angular/forms';
//import * as XLSX from 'xlsx'
import * as XLSX from 'xlsx';   // Para exportar a Excel
import jsPDF from 'jspdf';      // Para exportar a PDF
import 'jspdf-autotable';       // Para generar tablas en PDF
import moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize, takeUntil, max } from 'rxjs/operators';
import 'datatables.net';
import 'datatables.net-bs5';



@Component({
  selector: 'app-list-charges',
  standalone: true,
  imports: [UpdateChargeComponent, CommonModule, PeriodSelectComponent, ExpensesBillsNavComponent, ExpensesChargesNavComponent],
  templateUrl: './list-charges.component.html',
  styleUrl: './list-charges.component.css',
})

export class ListChargesComponent implements OnInit {
  
  charges: Charge[] = [];
  private chargeService = inject(ChargeService);
  private modalService = inject(NgbModal);

  selectedCharge: Charge | null = null;
  selectedCharges: number[] = [];
  categoryCharges: CategoryCharge[] = [];
  params : number[] = [];

  lots: Lot[] = [];

  datatable : any;
  private dateChangeSubject = new Subject<{ from: string, to: string }>();
  fileName : string = "Charges";

  private readonly periodService = inject(PeriodService);
  private readonly lotsService = inject(LotsService);

  //f//iltros : FormGroup;

  ngOnInit(): void {
    //$.noConflict();
    this.loadSelect();
    this.loadCategoryCharge();
    this.loadCharges();

   // this.filtros = new FormGroup({});
  }

  loadCharges(): void {
    
    if(this.lots.length !=0) {
      this.params.push();

    }
    this.chargeService.getCharges().subscribe((charges) => {
      this.charges = charges;
      console.log(charges);
      this.configDataTable();
    });
    
  }

  loadSelect() {
    this.periodService.get()
    this.lotsService.get().subscribe((data: Lot[]) => {
      this.lots = data;
    })
  }
  loadCategoryCharge(){
    this.chargeService.getCategoryCharges().subscribe((data: CategoryCharge[]) => {
      this.categoryCharges = data;
    })
  }

  toggleSelection(charge: Charge) {
    const index = this.selectedCharges.indexOf(charge.chargeId);
    if (index > -1) {
      this.selectedCharges.splice(index, 1);
    } else {
      this.selectedCharges.push(charge.chargeId);
    }
  }

  openDeleteModal(chargeId: number) {
    const modalRef = this.modalService.open(BorrarItemComponent);
    modalRef.componentInstance.chargeId = chargeId;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.deleteCharge(result);
        }
      },
      () => {}
    );
  }

  deleteCharge(chargeId: number) {
    this.chargeService.deleteCharge(chargeId).subscribe(() => {
      this.charges = this.charges.filter(
        (charge) => charge.fineId !== chargeId
      );
    });
  }

  openUpdateModal(charge: Charge) {
    const modalRef = this.modalService.open(UpdateChargeComponent);
    modalRef.componentInstance.charge = charge;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.loadCharges();
        }
      },
      () => {}
    );
  }

  downloadTable() {
    this.chargeService.getCharges().subscribe((charges) => {
      this.charges = charges;
    });
    const data = this.charges.map( charge => ({
      'Date': charge.date,
      'Amount': charge.amount,
      'Description': charge.description,
      'Category Charge': charge.categoryCharge.name,
      'Status': charge.status,
      'Lot': charge.lotId,
      'Period': charge.period
    }))
    // this.service.getExpenses(0, 100000, this.selectedPeriodId, this.selectedLotId, this.selectedTypeId).subscribe(expenses => {
    //   // Mapear los datos a un formato tabular adecuado
    //   const data = expenses.content.map(expense => ({
    //     'Period': expense.period.start_date,
    //     'Total Amount': expense.totalAmount,
    //     'Liquidation Date': expense.liquidationDate,
    //     'State': expense.state,
    //     'Plot Number': expense.plotNumber,
    //     'Plot Type': expense.typePlot,
    //     'Percentage': expense.percentage,
    //     'Bill Type': expense.billType
    //   }));
  
      // Convertir los datos tabulares a una hoja de cálculo
      var fecha = new Date();
      this.fileName += "-"+fecha.getDay()+"_"+(fecha.getMonth()+1)+"_"+fecha.getFullYear()+".xlsx"
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Cargos');
      XLSX.writeFile(wb, this.fileName);
    // })}
}

  // Exportar a PDF
  exportToPDF(): void {
    const doc = new jsPDF();

    // Título principal del PDF
    const pageTitle = 'Listado de Cargos';
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(pageTitle, doc.internal.pageSize.width / 2, 20, { align: 'center' });

    // Subtítulo con las fechas
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    //doc.text(`Fechas: Desde ${moment(this.fechaDesde).format('DD/MM/YYYY')} hasta ${moment(this.fechaHasta).format('DD/MM/YYYY')}`, 15, 30);

    // Obtener los datos filtrados de la tabla
    const table = $('#tableCharges').DataTable();
    const filteredData = table.rows({ search: 'applied' }).data().toArray();

    // Formato de los datos de la tabla para el PDF
    const pdfData = filteredData.map(charge => {
      const [category, ...rest] = charge.description.split(' - ');
      return [
        moment(charge.date).format('DD/MM/YYYY'),
        charge.lotId,
        charge.categoryCharge.name,
        category,
        `$${charge.amount.toFixed(2)}`
      ];
    });

    let pageCount = 0;

    // Configuración de la tabla en el PDF
    (doc as any).autoTable({
      head: [['Fecha', 'Lote', 'Categoría', 'Descripción', 'Monto']],
      body: pdfData,
      startY: 40, 
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185], // Azul
        textColor: [255, 255, 255], // Blanco
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        halign: 'center',
        valign: 'middle',
      },
      margin: { top: 30, bottom: 20 },
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      didDrawPage: function (data:any) {
        pageCount++;
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height || pageSize.getHeight();

        // Título y número de página en el pie
        doc.setFontSize(10);
        const text = `Página ${pageCount}`;
        const textWidth = doc.getTextWidth(text);
        doc.text(text, (pageSize.width / 2) - (textWidth / 2), pageHeight - 10);
      }
    });

    // Guardar el PDF con fecha en el nombre del archivo
    const fecha = new Date();
    const title = `${fecha.getDate()}_${fecha.getMonth() + 1}_${fecha.getFullYear()}`;
    doc.save(`Cargos_${title}.pdf`);

  }
  
  //Exportar a Excel
  exportToExcel(): void {
    // Asegúrate de que estás usando xlsx-style o un paquete que soporte estilos
    const table = $('#tableCharges').DataTable();
    const filteredData = table.rows({ search: 'applied' }).data().toArray();

    // Encabezado del Excel
    const encabezado = [
      [`Listado de Gastos`],
      [],
      ['Fecha', 'Lote', 'Categoría', 'Descripción', 'Monto']
    ];

    // Datos de la tabla
    const excelData = filteredData.map(charge => {
      const [category, ...rest] = charge.description.split(' - ');
      return [
        moment(charge.date).format('DD/MM/YYYY'),
        charge.lotId,
        charge.categoryCharge.name,
        category,
        `$${charge.amount.toFixed(2)}`
      ];
    });

    // Combinación de encabezados y datos
    const worksheetData = [...encabezado, ...excelData];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Estilos para el encabezado
    const headerCellStyle = {
      font: {
        bold: true,
        color: { rgb: "FFFFFF" }, // Color de texto blanco
      },
      fill: {
        fgColor: { rgb: "4F81BD" } // Color de fondo azul
      },
      alignment: {
        horizontal: "center",
        vertical: "center"
      }
    };

    // Aplicar estilo al encabezado
    for (let col = 0; col < encabezado[2].length; col++) {
      const cellAddress = XLSX.utils.encode_cell({ c: col, r: 2 }); // Encabezado está en la tercera fila
      worksheet[cellAddress].s = headerCellStyle; // Estilo para el encabezado
    }

    // Ajustar el ancho de las columnas automáticamente
    const columnWidths = excelData.reduce((acc, row) => {
      row.forEach((cell, index) => {
        const cellLength = cell ? cell.toString().length : 0;
        if (!acc[index] || cellLength > acc[index]) {
          acc[index] = cellLength;
        }
      });
      return acc;
    }, [0, 0, 0, 0, 0]);

    // Establecer el ancho de las columnas en función del contenido
    worksheet['!cols'] = columnWidths.map(length => ({ wch: length + 2 })); // +2 para margen adicional

    // Crear el libro de trabajo y agregar la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Gastos');

    // Guardar el archivo
    const fecha = new Date();
    const title = `${fecha.getDate()}_${fecha.getMonth() + 1}_${fecha.getFullYear()}`;
    XLSX.writeFile(workbook, `listado_gastos_${title}.xlsx`);


  }

    // Actualizar la tabla DataTable con los nuevos datos
    configDataTable() {
      jQuery.noConflict();
      
      console.log(this.charges);
      if ($.fn.DataTable.isDataTable('#tableCharges')) {
        const table = $('#tableCharges').DataTable();
        table.clear();
        table.rows.add(this.charges);
        table.draw();
        return;
      }
    
      $('#tableCharges').DataTable({
        paging: true,
        searching: true,
        ordering: true,
        lengthChange: false,
        pageLength: 10,
        data: this.charges,
        /*
        amount: number;
    categoryCharge: CategoryCharge;
    chargeId: number;
    date: Date;
    fineId: number;
    lotId: number;
    period: number;
    status: boolean;
    description: string;
        */
        columns: [
          { title: "ID", data: 'chargeId', visible: false },
          { data: 'categoryCharge.name', title: 'Categoría' },
          { data: 'lotId', title: 'Lote'},
          { data: 'date', title: 'Fecha', 
            render: function(data) {
              return moment(data, 'YYYY-MM-DD').format('DD/MM/YYYY');
            },
            type: 'date-moment'
          },
          { data: 'description', title: 'Descripción' },
          
          {
            data: 'amount',
            title: 'Monto',
            render: (data) => `$${data}`,
          },       
          {
            title: "Acciones",
            data: "period",
            orderable: false,
            className: 'text-center',
            render: function(data, type, row) {
              if(data === 2){
                return `<button class="btn btn-primary btn-sm mr-2" href="#">
                        <i class="bi bi-eye"></i> 
                      </button>`;
              }
              return `
              <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          Dropdown button
        </button>
        <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        <li><a class="dropdown-item" href="#">Something else here</a></li>
        </ul>
    </div>               
              `;
            }
        },   
          
          
        ],
        language: {
          search: 'Buscar:',
          info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
          paginate: {
            first: 'Primero',
            last: 'Último',
            next: 'Siguiente',
            previous: 'Anterior'
          },
          zeroRecords: 'No se encontraron resultados',
          emptyTable: 'No hay datos disponibles'
        }
      });
      const table = $('#tableCharges').DataTable();

    $('#tableCharges tbody').on('click', '.btn-view', (event) => {
      const row = $(event.currentTarget).closest('tr');
      const rowData = table.row(row).data();
      this.openUpdateModal(rowData.id);
    });

    $('#tableCharges tbody').on('click', '.btn-edit', (event) => {
      const row = $(event.currentTarget).closest('tr');
      const rowData = table.row(row).data();
      this.openUpdateModal(rowData.id);
    });

    $('#tableCharges tbody').on('click', '.btn-delete', (event) => {
      const row = $(event.currentTarget).closest('tr');
      const rowData = table.row(row).data();
      const chargeId= rowData.id
      this.openDeleteModal(chargeId)
    });
  }

}
