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
  TableFiltersComponent,
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
    TableFiltersComponent,
  ],
  templateUrl: './expenses-list-bills.component.html',
  styleUrl: './expenses-list-bills.component.css',
  providers: [DatePipe]
})
export class ExpensesListBillsComponent implements OnInit {
  //Lista de todos los bills
  bills: Bill[] = [];

  updatedBill: Bill | undefined;

  filterConfig: Filter[] = [];
  categoryList: { value: string, label: string }[] = [];
  supplierList: { value: string, label: string }[] = [];
  periodsList: { value: string, label: string }[] = [];
  typesList: { value: string, label: string }[] = [];


  ngOnInit(): void {
    this.getCategories();
    this.getProviders();
    this.getPeriods();
    this.getBillTypes();
  
    // Configura el filtro después de obtener los datos
    this.initializeFilters();
  }
  
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
    this.billservice.getBillTypes().subscribe((types) => {
      this.typesList = types.map((type: any) => ({
        value: type.id,
        label: type.name
      }));
      this.initializeFilters();
    });
  }
  
  //Lista de bills filtradas
  filteredBills: Bill[] = [];
  //Categorias inyectadas
  billservice = inject(BillService);
  categoryService = inject(CategoryService);
  periodService = inject(PeriodService);
  providerService = inject(ProviderService);
  modal = inject(NgbModal);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  isLoading: boolean = false;
  totalElements: number = 0;
  totalItems: number = 0;
  cantPages: number[] = [];
  indexActive = 1;


  onItemsPerPageChange() {
    this.currentPage = 1;
  }
  
  onPageChange(number: number) {
    this.currentPage = number;
    this.loadBills();
  }
  

  //Atributos
  //Lista de categorias

  searchTerm: string = '';
  visiblePages: number[] = [];
  maxPagesToShow: number = 5;
  //Filtros para buscar el objeto
  filters = new FormGroup({
    selectedCategory: new FormControl(0),
    selectedPeriod: new FormControl<number>(0),
    selectedSupplier: new FormControl(0),
    selectedProvider: new FormControl('SUPPLIER'),
    selectedStatus: new FormControl('ACTIVE'),
    selectedType: new FormControl(0),
  });

  //
  // categoryList: Category[] = [];
  // supplierList: Provider[] = [];
  // periodsList: Period[] = [];
  // typesList: BillType[] = [];
  today: Date = new Date();
  fileName = `Gastos_${this.today.toLocaleDateString()}.xlsx`;

  viewList: boolean = true;
  billForm: FormGroup;
  selectedBill: Bill | undefined;
  private modalService = inject(NgbModal);
  newCategoryForm: FormGroup;

  constructor() {
    this.billForm = this.fb.group({
      category_id: ['', Validators.required],
      description: [''],
      amount: ['', [Validators.required, Validators.min(0.0001)]],
      date: ['', Validators.required],
      supplierId: ['', [Validators.required]],
      typeId: ['', [Validators.required]],
      periodId: ['', [Validators.required]],
      status: ['ACTIVE', Validators.required],
    });
    this.newCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(2)]],
    });
  }
  //Metodo que se ejecuta cuando se inicia el componente
  // ngOnInit(): void {
  //   this.isLoading = true;
  //   this.unFilterBills();
  //   this.loadBills();
  //   this.loadSelect();
  // }

  //Elimina los filtros y vuelve a buscar por todos los valores disponibles
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

  //Primer llamado, trae todos los bills que hay
  loadBills() {
    this.bills = [];
    this.isLoading = true;
    const filters = this.filters.value;
    this.billservice
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
          this.totalElements = response.totalElements;
          console.log(this.totalElements, this.pageSize);
          console.log(response);
          response.content.map((bill) => {
            this.bills.push(
              new Bill(
                bill.expenditure_id,
                bill.date,
                bill.amount,
                bill.description,
                bill.supplier,
                bill.period,
                bill.category,
                bill.bill_type,
                bill.status
              )
            );
          });
        },
        error: (error) => {
          console.error('Error al cargar las facturas:', error);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  updatePageSize() {
    this.currentPage = 0; // Reinicia a la primera página
    this.loadBills();
  }

  //Trae todas las categorias
  // getCategories() {
  //   this.categoryService.getAllCategories().subscribe((categories) => {
  //     this.categoryList = categories;
  //   });
  // }
  // //Trae todas los supplier
  // getProviders() {
  //   this.providerService.getAllProviders().subscribe((providers) => {
  //     this.supplierList = providers;
  //   });
  // }
  // //Trae todas los períodos
  // getPeriods() {
  //   this.periodService.get().subscribe((periods) => {
  //     this.periodsList = periods;
  //   });
  // }
  // //Trae todas los tipos de bill disponibles
  // getBillTypes() {
  //   this.billservice.getBillTypes().subscribe((types) => {
  //     this.typesList = types;
  //   });
  //   console.log(`Tipos:${this.typesList}`);
  // }
  //Abre el modal y muestra los campos del gasto seleccionado
  viewBill(bill: Bill) {
    this.openViewModal(bill);
  }
  //Abre el modal de edicion y carga los campos del gasto seleccionado
  editBill(bill: Bill) {
    this.openEditModal(bill);
  }
  //Abre el modal de confirmacion de borrado
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
    modalRef.componentInstance.bill = bill; // Pasas el bill al componente

    modalRef.result.then((result) => {
      if (result === 'updated') {
        this.loadBills(); // Recargar la lista de facturas
      }
    });
  }

  //Carga los valores en los filtros existentes
  loadSelect() {
    this.getCategories();
    this.getProviders();
    this.getPeriods();
    this.getBillTypes();
  }
  nuevoGasto() {
    this.router.navigate(['/gastos/nuevo']);
  }
  //Resetea los valores del modal de edicion

  //Guarda la nueva categoría

  //Método que formatea de BillDto a entidad Bill

  //Generación de documentos
  //Generación de pdf

  //Generación de documentos
  //Generación de pdf
  imprimir() {
    console.log('Imprimiendo');
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.text('Bills Report', 14, 20);
    const filters = this.filters.value;
    // Llamada al servicio para obtener las expensas
    this.billservice
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
        // Usando autoTable para agregar la tabla
        autoTable(doc, {
          startY: 30,
          head: [
            [
              'Periodo',
              'Monto total',
              'Fecha',
              'Estado',
              'Proveedor',
              'Categoría',
              'Tipo',
              'Descripción',
            ],
          ],
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

        // Guardar el PDF después de agregar la tabla
        doc.save(
          `Gastos_${this.today.getDay()}-${this.today.getMonth()}-${this.today.getFullYear()}/${this.today.getHours()}hs:${this.today.getMinutes()}min.pdf`
        );
        console.log('Impreso');
      });
  }
  //Generar excel con todos los datos
  //Crear excel con datos de los gastos que se muestran
  downloadTable() {
    const filters = this.filters.value;
    this.billservice
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
        // Mapear los datos a un formato tabular adecuado
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

        // Convertir los datos tabulares a una hoja de cálculo
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
        XLSX.writeFile(wb, this.fileName);
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

  filterChange($event: Record<string, any>) {
    throw new Error('Method not implemented.');
  }
}
