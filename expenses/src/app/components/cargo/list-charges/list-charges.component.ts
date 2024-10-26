import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
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
//import $ from "jquery";
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
//import * as XLSX from 'xlsx'
//import * as XLSX from 'xlsx';   // Para exportar a Excel
//import jsPDF from 'jspdf';      // Para exportar a PDF
import 'jspdf-autotable';       // Para generar tablas en PDF
//import moment from 'moment';
import { Subject } from 'rxjs';
//import { debounceTime, distinctUntilChanged, switchMap, tap, finalize, takeUntil, max } from 'rxjs/operators';
import 'datatables.net';
import 'datatables.net-bs5';
import 'bootstrap';
import { NgModalComponent } from '../../modals/ng-modal/ng-modal.component';

export interface ViewCharge {
  amount: number;
    categoryCharge: CategoryCharge;
    chargeId: number;
    date: Date;
    lot: number;
    period: number;
    description: string;
}

@Component({
  selector: 'app-list-charges',
  standalone: true,
  imports: [UpdateChargeComponent, CommonModule, PeriodSelectComponent, ExpensesBillsNavComponent, ExpensesChargesNavComponent,FormsModule,ReactiveFormsModule],
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

  totalElements: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;
  //rowsPerPage = 10;
  lots: Lot[] = [];

  datatable : any;
  private dateChangeSubject = new Subject<{ from: string, to: string }>();
  fileName : string = "Charges";

  private readonly periodService = inject(PeriodService);
  private readonly lotsService = inject(LotsService);

  //f//iltros : FormGroup;

  @ViewChild('exampleModal') exampleModal!: ElementRef;

  constructor() {}

  // openModal() {
  //   const modal = new b.Modal(this.exampleModal.nativeElement);
  //   modal.show();
  // }

  ngOnInit(): void {
    //$.noConflict();
    this.loadSelect();
    this.loadCategoryCharge();    
    this.cargarPaginado()
    //this.loadCharges(0,10);
    //this.configDataTable();
  }

  loadCharges(page:number,pageSize:number): void {
    
    if(this.lots.length !=0) {
      this.params.push();

    }
    this.chargeService.getCharges(page,pageSize,undefined,undefined,undefined).subscribe((charges) => {
      this.charges = charges.content;
      console.log(charges);
      //this.configDataTable();
    });
    
  }
  onPageChange(page: number): void {
    console.log(this.totalPages)
    if (page >= 0 && page < this.totalPages) {
    
      console.log('Cargando página ' + page);
      this.loadCharges(page,this.pageSize);
      this.currentPage = page; // Asegúrate de actualizar currentPage aquí
    }
  }
  // Función que se ejecuta cuando cambia el número de registros por página
  changesPageSize(newRowsPerPage: number) {
    console.log('Número de registros por página cambiado a:', newRowsPerPage);
    this.currentPage = 0;  // Reinicia la paginación a la primera página
    this.pageSize = newRowsPerPage;  // Actualiza el número de registros por página
    this.cargarPaginado();
  }
  cargarPaginado() {
    // Llamar al servicio con la paginación desde el backend.
    this.chargeService.getCharges(this.currentPage, this.pageSize, undefined, undefined, undefined).subscribe(response => {
      
      this.charges = response.content;  // Datos de la página actual
      this.totalPages = response.totalPages;  // Número total de páginas
      this.totalItems = response.totalElements;  // Total de registros
      this.currentPage = response.number; 
    });
  }
  getPlotNumber(lotId : number){
    const lot = this.lots.find(lot => lot.id === lotId);
    return lot ? lot.plot_number : undefined;
  }

  loadSelect() {
    this.periodService.get()
    this.lotsService.get().subscribe((data: Lot[]) => {
      this.lots = data;
    })
    this.lotsService.get().subscribe((data: Lot[]) => {
      this.lots = data;
    })
  }
  loadCategoryCharge(){
    this.chargeService.getCategoryCharges().subscribe((data: CategoryCharge[]) => {
      this.categoryCharges = data;
    })
  }

  openViewModal(charge: Charge) {
    // const register : ViewCharge 

    // register.lot = this.getPlotNumber(charge.lotId)!;
    const modalRef = this.modalService.open(UpdateChargeComponent);
    modalRef.componentInstance.charge = charge;

    modalRef.result.then(
      (result) => {
        if (result) {
          //this.loadCharges(0,10);
        }
      },
      () => {}
    );
  }

  openDeleteModal(chargeId: number) {
    const modalRef = this.modalService.open(BorrarItemComponent);
    modalRef.componentInstance.chargeId = chargeId;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.deleteCharge(result);
          const modalRefer = this.modalService.open(NgModalComponent);
          modalRefer.componentInstance.message = '¡El cargo ha sido eliminado correctamente!'
          this.cargarPaginado();
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
          //this.loadCharges(0,10);
        }
      },
      () => {}
    );
  }
    

}
