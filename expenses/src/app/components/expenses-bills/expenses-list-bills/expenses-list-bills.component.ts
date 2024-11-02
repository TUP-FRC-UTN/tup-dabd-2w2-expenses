import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Bill } from '../../../models/bill';
import { BillService } from '../../../services/bill.service';
import Period from '../../../models/period';
import { Provider } from '../../../models/provider';
import Category from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { ProviderService } from '../../../services/provider.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PeriodService } from '../../../services/period.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import BillType from '../../../models/billType';
import { CommonModule, DatePipe } from '@angular/common';
import { PeriodSelectComponent } from '../../selects/period-select/period-select.component';
import { PaginatedResponse } from '../../../models/paginatedResponse';
import { BillDto } from '../../../models/billDto';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { map, Observable } from 'rxjs';
import { NgPipesModule } from 'ngx-pipes';
import { EditBillModalComponent } from '../../modals/bills-modal/edit-bill-modal/edit-bill-modal.component';
import { ViewBillModalComponent } from '../../modals/bills-modal/view-bill-modal/view-bill-modal.component';
import { BillInfoComponent } from '../../modals/info/bill-info/bill-info.component';
import { ListBillsInfoComponent } from '../../modals/info/list-bills-info/list-bills-info.component';
import { Router } from '@angular/router';
import moment from 'moment';
import {
  Filter,
  FilterConfigBuilder,
  MainContainerComponent,
  TableFiltersComponent
} from 'ngx-dabd-grupo01';

@Component({
  selector: 'app-list-expenses_bills',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgbModule,
    PeriodSelectComponent,
    FormsModule,
    NgPipesModule,
    CommonModule,
    MainContainerComponent,
    TableFiltersComponent
  ],
  templateUrl: './expenses-list-bills.component.html',
  styleUrl: './expenses-list-bills.component.css',
  providers: [DatePipe]
})
export class ExpensesListBillsComponent implements OnInit {
  //#region VARIABLES
  bills: Bill[] = [];
  filteredBills: Bill[] = [];
  updatedBill: Bill | undefined;

  filterConfig: Filter[] = [];
  categoryList: { value: string, label: string }[] = [];
  supplierList: { value: string, label: string }[] = [];
  periodsList: { value: string, label: string }[] = [];
  typesList: { value: string, label: string }[] = [];

  searchTerm: string = '';
  visiblePages: number[] = [];
  maxPagesToShow: number = 5;

  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  totalItems: number = 0;
  cantPages: number[] = [];
  indexActive: number = 1;
  isLoading: boolean = false;

  viewList: boolean = true;
  today: Date = new Date();
  fileName: string = `Gastos_${this.today.toLocaleDateString()}.xlsx`;

  // billForm: FormGroup;
  // newCategoryForm: FormGroup;
  selectedBill: Bill | undefined;

  // FormGroup for filters
  filters = new FormGroup({
    selectedCategory: new FormControl(0),
    selectedPeriod: new FormControl<number>(0),
    selectedSupplier: new FormControl(0),
    selectedProvider: new FormControl('SUPPLIER'),
    selectedStatus: new FormControl('ACTIVE'),
    selectedType: new FormControl(0),
  });
  //#endregion

  //#region DEPENDENCY INJECTION
  billService = inject(BillService);
  categoryService = inject(CategoryService);
  periodService = inject(PeriodService);
  providerService = inject(ProviderService);
  modalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  //#endregion

  //#region INITIALIZATION AND DATA LOADING
  ngOnInit(): void {
    this.getCategories();
    this.getProviders();
    this.getPeriods();
    this.getBillTypes();
    this.loadBills();
    this.initializeFilters(); // Initialize filters after loading data

    // Form group initialization for bill and new category
    // this.billForm = this.fb.group({
    //   category_id: ['', Validators.required],
    //   description: [''],
    //   amount: ['', [Validators.required, Validators.min(0.0001)]],
    //   date: ['', Validators.required],
    //   supplierId: ['', Validators.required],
    //   typeId: ['', Validators.required],
    //   periodId: ['', Validators.required],
    //   status: ['ACTIVE', Validators.required],
    // });

    // this.newCategoryForm = this.fb.group({
    //   name: ['', [Validators.required, Validators.minLength(2)]],
    //   description: ['', [Validators.required, Validators.minLength(2)]],
    // });
  }

  getCategories() {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categoryList = categories.map((category: any) => ({
        value: category.id,
        label: category.name
      }));
      this.initializeFilters();  // Actualiza el filtro después de obtener datos
    });
  }

  getProviders() {
    this.providerService.getAllProviders().subscribe((providers) => {
      this.supplierList = providers.map((provider: any) => ({
        value: provider.id,
        label: provider.name
      }));
      this.initializeFilters();
    });
  }
  
  getPeriods() {
    this.periodService.get().subscribe((periods) => {
      this.periodsList = periods.map((period: any) => ({
        value: period.id,
        label: `${period.month}/${period.year}`
      }));
      this.initializeFilters();
    });
  }
  
  getBillTypes() {
    this.billService.getBillTypes().subscribe((types) => {
      this.typesList = types.map((type: any) => ({
        value: type.id,
        label: type.name
      }));
      this.initializeFilters();
    });
  }

  // Initialize filter configurations
  initializeFilters(): void {
    this.filterConfig = new FilterConfigBuilder()
      .selectFilter('Tipo', 'billType.name', 'Seleccione un tipo', this.typesList)
      .selectFilter('Proveedor', 'supplier.name', 'Seleccione un proveedor', this.supplierList)
      .numberFilter('Monto', 'amount', 'Ingrese el monto')
      .dateFilter('Fecha', 'date', 'Seleccione una fecha')
      .selectFilter('Categoría', 'category.name', 'Seleccione una categoría', this.categoryList)
      .radioFilter('Activo', 'isActive', [
        { value: 'true', label: 'Activo' },
        { value: 'false', label: 'Inactivo' },
        { value: 'undefined', label: 'Todo' },
      ])
      .build();
  }

  // Load select values for filter options
  loadSelect() {
    this.getCategories();
    this.getProviders();
    this.getPeriods();
    this.getBillTypes();
  }

  // Load all bills with pagination and filters
  loadBills() {
    this.bills = [];
    this.isLoading = true;
    const filters = this.filters.value;
    this.billService
      .getAllBillsAndPagination(
        this.pageSize,
        this.currentPage - 1,
        filters.selectedPeriod?.valueOf(),
        filters.selectedCategory?.valueOf(),
        filters.selectedSupplier?.valueOf(),
        filters.selectedType?.valueOf(),
        filters.selectedProvider?.valueOf().toString(),
        filters.selectedStatus?.valueOf().toString()
      )
      .subscribe({
        next: (response) => {
          console.log('Respuesta del servicio:', response);
          this.totalElements = response.totalElements;
          response.content.map((bill) => {
            this.bills.push(new Bill(bill.expenditure_id, bill.date, bill.amount, bill.description, bill.supplier, bill.period, bill.category, bill.bill_type, bill.status));
          });
        },
        error: (error) => console.error('Error al cargar las facturas:', error),
        complete: () => {
          console.log('Facturas cargadas:', this.bills);
          this.isLoading = false;
        },
      });
  }
  //#endregion

  //#region FILTER OPERATIONS
  unFilterBills() {
    this.filters.setValue({
      selectedCategory: 0,
      selectedPeriod: 0,
      selectedSupplier: 0,
      selectedProvider: 'SUPPLIER',
      selectedStatus: 'ACTIVE',
      selectedType: 0,
    });
    this.loadSelect();
    this.loadBills();
  }

  filterChange($event: Record<string, any>) {
    throw new Error('Method not implemented.');
  }
  //#endregion

  //#region PAGINATION AND PAGE SIZE
  onItemsPerPageChange() {
    this.currentPage = 1;
  }

  onPageChange(number: number) {
    this.currentPage = number;
    this.loadBills();
  }

  updatePageSize() {
    this.currentPage = 0;
    this.loadBills();
  }
  //#endregion

  //#region MODAL OPERATIONS
  viewBill(bill: Bill) {
    this.openViewModal(bill);
  }

  editBill(bill: Bill) {
    this.openEditModal(bill);
  }

  openViewModal(bill: Bill) {
    const modalRef = this.modalService.open(ViewBillModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.bill = bill;
  }

  openEditModal(bill: Bill) {
    const modalRef = this.modalService.open(EditBillModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.bill = bill;

    modalRef.result.then((result) => {
      if (result === 'updated') {
        this.loadBills();
      }
    });
  }

  showInfo(): void {
    this.modalService.open(ListBillsInfoComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      centered: true,
      scrollable: true,
    });
  }
  //#endregion

  //#region DOCUMENT GENERATION
  imprimir() {
    console.log('Imprimiendo');
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Bills Report', 14, 20);

    const filters = this.filters.value;
    this.billService
      .getAllBills(
        100000,
        0,
        filters.selectedPeriod?.valueOf(),
        filters.selectedCategory?.valueOf(),
        filters.selectedSupplier?.valueOf(),
        filters.selectedType?.valueOf(),
        filters.selectedProvider?.valueOf().toString(),
        filters.selectedStatus?.valueOf().toString()
      )
      .subscribe((bills) => {
        autoTable(doc, {
          startY: 30,
          head: [['Periodo', 'Monto total', 'Fecha', 'Estado', 'Proveedor', 'Categoría', 'Tipo', 'Descripción']],
          body: bills.map((bill) => [
            bill.period ? `${bill.period.month}/${bill.period.year}` : null,
            bill.amount ? `$ ${bill.amount}` : null,
            moment(bill.date).format('DD/MM/YYYY'),
            bill.status ? bill.status : null,
            bill.supplier ? bill.supplier.name : null,
            bill.category ? bill.category.name : null,
            bill.billType ? bill.billType.name : null,
            bill.description,
          ]),
        });
        doc.save(`Gastos_${this.today.getDay()}-${this.today.getMonth()}-${this.today.getFullYear()}/${this.today.getHours()}hs:${this.today.getMinutes()}min.pdf`);
        console.log('Impreso');
      });
  }

  downloadTable() {
    const filters = this.filters.value;
    this.billService
      .getAllBillsAndPagination(
        500000,
        0,
        filters.selectedPeriod?.valueOf(),
        filters.selectedCategory?.valueOf(),
        filters.selectedSupplier?.valueOf(),
        filters.selectedType?.valueOf(),
        filters.selectedProvider?.valueOf().toString(),
        filters.selectedStatus?.valueOf().toString()
      )
      .subscribe((bills) => {
        const data = bills.content.map((bill) => ({
          Periodo: `${bill?.period?.month} / ${bill?.period?.year}`,
          'Monto Total': `$ ${bill.amount}`,
          Fecha: bill.date,
          Proveedor: bill.supplier?.name,
          Estado: bill.status,
          Categoría: bill.category.name,
          'Tipo de gasto': bill.bill_type?.name,
          Descripción: bill.description,
        }));

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
        XLSX.writeFile(wb, this.fileName);
      });
  }
  //#endregion

  //#region NAVIGATION
  nuevoGasto() {
    this.router.navigate(['/gastos/nuevo']);
  }
  //#endregion
}
