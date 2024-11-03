import {
  Component,
  ElementRef,
  inject,
  NgModule,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Charge, ChargeFilters, Charges, PeriodCharge } from '../../../models/charge';
import { ChargeService } from '../../../services/charge.service';
import { CategoryCharge } from '../../../models/charge';
import { ExpensesUpdateChargeComponent } from '../expenses-update-charge/expenses-update-charge.component';
import { CommonModule, DatePipe } from '@angular/common';
import { PeriodSelectComponent } from '../../selects/period-select/period-select.component';
import Lot, { Lots } from '../../../models/lot';
import { LotsService } from '../../../services/lots.service';
import { PeriodService } from '../../../services/period.service';
import { BorrarItemComponent } from '../../modals/borrar-item/borrar-item.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'xlsx'; // Para exportar a Excel
import jsPDF from 'jspdf'; // Para exportar a PDF
import moment from 'moment';
//import { Subject } from 'rxjs';
//import { debounceTime, distinctUntilChanged, switchMap, tap, finalize, takeUntil, max } from 'rxjs/operators';
// import 'bootstrap';
import { NgModalComponent } from '../../modals/ng-modal/ng-modal.component';
import { ExpensesModalComponent } from '../../modals/expenses-modal/expenses-modal.component';
import Period from '../../../models/period';
import { NgPipesModule } from 'ngx-pipes';
import {
  Filter,
  FilterConfigBuilder,
  MainContainerComponent,
  TableComponent,
  TableFiltersComponent,
  ToastService,
} from 'ngx-dabd-grupo01';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { debounceTime, forkJoin, Subject } from 'rxjs';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-expenses-list-charges',
  standalone: true,
  imports: [
    ExpensesUpdateChargeComponent,
    CommonModule,
    PeriodSelectComponent,
    FormsModule,
    ReactiveFormsModule,
    NgPipesModule,
    TableComponent,
    ExpensesModalComponent,
    NgbModule,
    MainContainerComponent,
    TableFiltersComponent
  ],
  templateUrl: './expenses-list-charges.component.html',
  styleUrl: './expenses-list-charges.component.css',
  providers: [DatePipe],
})
export class ExpensesListChargesComponent implements OnInit {
addCharge() {
throw new Error('Method not implemented.');
}
showInfo() {
throw new Error('Method not implemented.');
/*
// 'Se muestra una lista con todos los periodos, con su estado y sus montos de liquidaciones de expensas tanto ordinarias como extraordinarias. En la fila del periodo se visualizan distintas acciones para cerrar los periodos en vigencia y poder visualizar mayor detalle de los mismos.'
    const modalRef = this.modalService.open(ConfirmAlertComponent);

    modalRef.componentInstance.alertMessage =
      'Se muestra una lista con todos los periodos, con su estado y sus montos de liquidaciones de expensas tanto ordinarias como extraordinarias. En la fila del periodo se visualizan distintas acciones para cerrar los periodos en vigencia y poder visualizar mayor detalle de los mismos.';
    modalRef.componentInstance.alertType = 'info';

    this.idClosePeriod = null;
*/
}
  // Variables de Filtros y Paginación
  //#region FILTER VARIABLES
  searchTerm = '';
  selectedLotId: number = 0;
  selectedCategoryId: number = 0;
  selectedPeriodId: number = 0;

  applyFilterWithNumber: boolean = false;
  applyFilterWithCombo: boolean = false;
  contentForFilterCombo: string[] = [];
  actualFilter: string | undefined = ChargeFilters.NOTHING;
  filterTypes = ChargeFilters;
  filterInput: string = '';

  

  //#endregion

  // Variables de Carga de Datos y Paginación
  //#region DATA VARIABLES
  charges: Charge[] = [];
  chargesCompleted : Charges[] = [];
  chargeId: number = 0;
  lots: Lots[] = [];
  categorias: CategoryCharge[] = [];
  periodos: Period[] = [];
  totalElements: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;
  cantPages: number[] = [];
  indexActive = 1;
  isLoading: boolean = true;
  fileName: string = 'Cargos';
  selectedCharge: Charge | null = null;
  selectedCharges: number[] = [];
  params: number[] = [];
  filterSubject = new Subject<Charges[]>();
  filter$ = this.filterSubject.asObservable();
  itemsList!: Charges[];
  filterConfig: Filter[] = [];
  filterChange($event: Record<string, any>) {
    console.log($event)
  }

  //#endregion

  // Servicios Inyectados
  //#region INJECTED SERVICES
  private chargeService = inject(ChargeService);
  private modalService = inject(NgbModal);
  private readonly router = inject(Router);
  private readonly periodService = inject(PeriodService);
  private readonly lotsService = inject(LotsService);
  toastService: ToastService = inject(ToastService);
  //#endregion

  // Métodos de Filtro y Paginación
  //#region FILTER OPERATIONS
  applyFilters() {
    this.currentPage = 0;
    this.cargarPaginado();
  }

  clearFilters() {
    this.selectedCategoryId = 0;
    this.selectedLotId = 0;
    this.selectedPeriodId = 0;
    this.cargarPaginado();
    this.searchTerm = '';
  }

  createFilters() {
    this.filterConfig = new FilterConfigBuilder()

  
  .selectFilter('Categoría', 'categoryCharge', 'Seleccione una categoría', this.categorias.map(category => ({
    value: category.categoryChargeId.toString(),
    label: category.name
  })))
  .selectFilter('Lote','lots','Seleccione un lote', this.lots.map(lot => ({
    value: lot.id.toString(),
    label: lot.plot_number.toString()
  })))
  .selectFilter('Tipo de Cargo','chargeType','Seleccione un tipo',  [
    { value: 'Positivo', label: 'Positivo' },
    { value: 'Porcentaje', label: 'Porcentaje' },
    { value: 'Negativo', label: 'Negativo' }
  ])
  .radioFilter('Activo', 'isActive', [
    {value: 'true', label: 'Activo'},
    {value: 'false', label: 'Inactivo'},
    {value: 'undefined', label: 'Todo'},
  ])
  .build()
  }

  

  //#endregion

  // Métodos de Carga de Datos
  //#region DATA LOADING
  ngOnInit(): void {
    this.loadSelect();
    //this.loadCategoryCharge();
    this.cargarPaginado();
  }

  loadSelect() {
    forkJoin({
      periodos: this.periodService.get(),
      lots: this.lotsService.get(),
      categories: this.chargeService.getCategoryCharges(),
    }).subscribe({
      next: ({ periodos, lots, categories }) => {
        this.periodos = periodos;
        this.lots = lots;
        console.log('Lotes:', this.lots);
        this.categorias = categories;
        this.createFilters();
        this.cargarPaginado();
      },
      error: (error) => {
        console.error('Error al cargar los datos en loadSelect:', error);
      }
    });
  }

  loadCategoryCharge() {
    this.chargeService
      .getCategoryCharges()
      .subscribe((data: CategoryCharge[]) => {
        this.categorias = data;
        this.createFilters();
      });
  }

  loadCharges(page: number, pageSize: number): void {
    this.chargeService.getCharges(page, pageSize).subscribe((charges) => {
      this.charges = charges.content;
    });
  }

  cargarPaginado() {
    const period = this.selectedPeriodId || undefined;
    const category = this.selectedCategoryId || undefined;
    const lot = this.selectedLotId || undefined;

    this.chargeService
      .getCharges(this.currentPage, this.pageSize, period, lot, category)
      .subscribe((response) => {
        this.charges = response.content;
        this.charges = response.content.map(charge => {
          const charges = this.keysToCamel(charge) as Charge; //Cambiar de snake_Case a camelCase
          return {
            ...charges,
            plotNumber: this.getPlotNumber(charge.lotId), //
          };
  
        });
        this.loadChargesCompleted();
        this.totalPages = response.totalPages;
        this.totalItems = response.totalElements;
        this.currentPage = response.number;
      });
    console.log(this.charges);
  }


  loadChargesCompleted() {
    this.chargesCompleted = this.charges.map(charge => ({
      ...charge,
      plotNumber: this.getPlotNumber(charge.lotId),
    }));
    console.log(this.chargesCompleted);
  }
  //#endregion

  // Métodos de Exportación e Impresión
  //#region EXPORT & PRINT
  imprimir() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Cargos', 14, 20);

    this.chargeService
      .getCharges(
        0,
        100000,
        this.selectedPeriodId,
        this.selectedLotId,
        this.selectedCategoryId
      )
      .subscribe((charges) => {
        autoTable(doc, {
          startY: 30,
          head: [
            ['Fecha', 'Periodo', 'Lote', 'Categoría', 'Descripción', 'Monto'],
          ],
          body: charges.content.map((charge) => [
            moment(charge.date).format('DD/MM/YYYY'),
            `${charge.period.month}/${charge.period.year}`,
            this.getPlotNumber(charge.lotId) || 'N/A',
            charge.categoryCharge.name,
            charge.description,
            charge.amount,
          ]),
        });

        const fecha = new Date();
        this.fileName += `-${fecha.getDate()}_${
          fecha.getMonth() + 1
        }_${fecha.getFullYear()}.pdf`;
        doc.save(this.fileName);
      });
  }

  downloadTable() {
    this.chargeService
      .getCharges(
        0,
        100000,
        this.selectedPeriodId,
        this.selectedLotId,
        this.selectedCategoryId
      )
      .subscribe((charges) => {
        const data = charges.content.map((charge) => ({
          'Fecha de Carga': moment(charge.date).format('DD/MM/YYYY'),
          Periodo: `${charge.period.month}/${charge.period.year}`,
          'Número de lote': this.getPlotNumber(charge.lotId),
          Categoría: charge.categoryCharge.name,
          Descripción: charge.description,
          Monto: charge.amount,
          Estado: charge.status,
        }));

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Cargos');

        const fecha = new Date();
        this.fileName += `-${fecha.getDate()}_${
          fecha.getMonth() + 1
        }_${fecha.getFullYear()}.xlsx`;
        XLSX.writeFile(wb, this.fileName);
      });
  }
  //#endregion

  // Métodos de Modales
  //#region MODALS
  open(content: TemplateRef<any>, id: number | null) {
    this.chargeId = id || 0;
    const modalRef = this.modalService.open(content);
    modalRef.componentInstance.onAccept.subscribe(() =>
      this.deleteCharge(this.chargeId)
    );
  }

  openViewModal(charge: Charge) {
    const modalRef = this.modalService.open(ExpensesUpdateChargeComponent);
    modalRef.componentInstance.charge = charge;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.toastService.sendSuccess('Se actualizó el cargo correctamente');
          this.currentPage = 0;
          this.cargarPaginado();
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
          this.cargarPaginado();
        }
      },
      () => {}
    );
  }

  openUpdateModal(charge: Charge) {
    const modalRef = this.modalService.open(ExpensesUpdateChargeComponent);
    modalRef.componentInstance.charge = charge;
    modalRef.componentInstance.isEditing = true;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.currentPage = 0;
          this.cargarPaginado();
          this.toastService.sendSuccess(
            'Se ha actualizado el cargo correctamente'
          );
        }
      },
      () => {}
    );
  }
  //#endregion

  // Operaciones de Eliminación
  //#region DELETE OPERATIONS
  deleteCharge2() {
    if (this.chargeId) {
      this.deleteCharge(this.chargeId);
    }
  }

  deleteCharge(chargeId: number) {
    this.chargeService.deleteCharge(chargeId).subscribe({
      next: () => {
        this.currentPage = 0;
        this.clearFilters();
        this.cargarPaginado();
        this.toastService.sendSuccess('Se ha eliminado el cargo correctamente');
      },
      error: () => {
        this.toastService.sendError(
          'Ha ocurrido un error al eliminar el cargo'
        );
      },
    });
    this.chargeId = 0;
  }
  //#endregion

  // Otros Métodos
  //#region OTHER METHODS
  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadCharges(page, this.pageSize);
      this.currentPage = page;
    }
  }

  changesPageSize(newRowsPerPage: number) {
    this.currentPage = 0;
    this.pageSize = newRowsPerPage;
    this.cargarPaginado();
  }

  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.pageSize = Number(selectElement.value);
  }

  getPlotNumber(lotId: number) {
    const lot = this.lots.find((lot) => lot.id === lotId);
    return lot ? lot.plot_number : undefined;     
  }

  isClosed(period: PeriodCharge): boolean {
    return period.state === 'closed';
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
  //#endregion

  //#region METODOS FILTER BUTTONS
  onFilterTextBoxChanged(event: Event){
    // const target = event.target as HTMLInputElement;

    // if (target.value?.length <= 2) {
    //   this.filterSubject.next(this.itemsList);
    // } else {
    //   const filterValue = target.value.toLowerCase();

    //   const filteredList = this.itemsList.filter(item => {
    //     return Object.values(item).some(prop => {
    //       const propString = prop ? prop.toString().toLowerCase() : '';

    //       const translations = this.dictionaries && this.dictionaries.length
    //         ? this.dictionaries.map(dict => this.translateDictionary(propString, dict)).filter(Boolean)
    //         : [];

    //       return propString.includes(filterValue) || translations.some(trans => trans?.toLowerCase().includes(filterValue));
    //     });
    //   });

    //   this.filterSubject.next(filteredList.length > 0 ? filteredList : []);
    // }
  }
}
