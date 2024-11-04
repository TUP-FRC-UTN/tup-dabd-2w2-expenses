import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Bill } from '../../../models/bill';
import { BillService } from '../../../services/bill.service';
import { CategoryService } from '../../../services/category.service';
import { ProviderService } from '../../../services/provider.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PeriodService } from '../../../services/period.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import BillType from '../../../models/billType';
import { CommonModule, DatePipe } from '@angular/common';
import { PeriodSelectComponent } from '../../selects/period-select/period-select.component';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgPipesModule } from 'ngx-pipes';
import { EditBillModalComponent } from '../../modals/bills-modal/edit-bill-modal/edit-bill-modal.component';
import { ViewBillModalComponent } from '../../modals/bills-modal/view-bill-modal/view-bill-modal.component';
import { ListBillsInfoComponent } from '../../modals/info/list-bills-info/list-bills-info.component';
import { Router } from '@angular/router';
import moment from 'moment';
import {
  Filter,
  FilterConfigBuilder,
  MainContainerComponent,
  TableColumn,
  TableComponent,
  TableFiltersComponent,
  TablePagination,
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
    TableComponent,
  ],
  templateUrl: './expenses-list-bills.component.html',
  styleUrl: './expenses-list-bills.component.css',
  providers: [DatePipe],
})
export class ExpensesListBillsComponent implements OnInit {
  //#region VARIABLES
  bills: Bill[] = [];
  filteredBills: Bill[] = [];
  updatedBill: Bill | undefined;

  filterConfig: Filter[] = [];
  categoryList: { value: string; label: string }[] = [];
  supplierList: { value: string; label: string }[] = [];
  periodsList: { value: string; label: string }[] = [];
  typesList: { value: string; label: string }[] = [];

  totalItems = 0;
  page = 1;
  size = 10;
  sizeOptions: number[] = [10, 25, 50];
  sortField = 'billType.name';
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = '';
  visiblePages: number[] = [];
  maxPagesToShow: number = 5;

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
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

  filterTableByText(value: string) {
    const filterValue = value?.toLowerCase() || '';
    if (filterValue === '') {
      this.filteredBills = this.bills;
      return;
    }

    this.filteredBills = this.bills.filter(
      (bill) =>
        (bill.billType?.name
          ? bill.billType.name.toLowerCase().includes(filterValue)
          : false) ||
        (bill.supplier?.name
          ? bill.supplier.name.toLowerCase().includes(filterValue)
          : false) ||
        (bill.amount
          ? bill.amount.toString().toLowerCase().includes(filterValue)
          : false) ||
        (bill.period?.end_date
          ? bill.period.end_date
              .toISOString()
              .toLowerCase()
              .includes(filterValue)
          : false) ||
        (bill.category?.name
          ? bill.category.name.toLowerCase().includes(filterValue)
          : false) ||
        (bill.date
          ? bill.date.toString().toLowerCase().includes(filterValue)
          : false) ||
        (bill.description
          ? bill.description.toLowerCase().includes(filterValue)
          : false) ||
        (bill.status ? bill.status.toLowerCase().includes(filterValue) : false)
    );
  }

  filterTableBySelects(value: Record<string, any>) {
    const filterCategory = value['selectedCategory'] || 0;
    const filterSupplier = value['selectedSupplier'] || 0;
    const filterPeriod = value['selectedPeriod'] || 0;
    const filterType = value['selectedType'] || 0;

    this.filteredBills = this.bills.filter((bill) => {
      const matchesCategory = filterCategory
        ? bill.category?.category_id === filterCategory
        : true;
      const matchesSupplier = filterSupplier
        ? bill.supplier?.id === filterSupplier
        : true;
      const matchesPeriod = filterPeriod
        ? bill.period?.id === filterPeriod
        : true;
      const matchesType = filterType
        ? bill.billType?.bill_type_id === filterType
        : true;

      return matchesCategory && matchesSupplier && matchesPeriod && matchesType;
    });
  }

  onSearchValueChange(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.page = 1; // Resetea a la primera página cuando buscas
    this.filterTableByText(searchTerm);
  }

  onFilterChange() {
    const filters = this.filters.value;
    this.filterTableBySelects(filters);
  }

  onFilterValueChange($event: Record<string, any>) {
    this.filterTableBySelects($event);
  }

  //#endregion

  @ViewChild('amountTemplate', { static: true })
  amountTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', { static: true })
  actionsTemplate!: TemplateRef<any>;

  columns: TableColumn[] = [
    // { headerName: 'Tipo', accessorKey: 'billType.name' },
    // { headerName: 'Proveedor', accessorKey: 'supplier.name' },
    // {
    //   headerName: 'Monto',
    //   accessorKey: 'amount',
    //   cellRenderer: this.amountTemplate,
    // },
    // { headerName: 'Periodo', accessorKey: 'period.end_date' },
    // { headerName: 'Categoría', accessorKey: 'category.name' },
    // { headerName: 'Fecha', accessorKey: 'date', cellRenderer: this.dateTemplate },
    // {
    //   headerName: 'Acciones',
    //   accessorKey: 'actions',
    //   cellRenderer: this.actionsTemplate,
    // },
  ];

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.columns = [
        { headerName: 'Tipo', accessorKey: 'billType.name' },
    { headerName: 'Proveedor', accessorKey: 'supplier.name' },
    {
      headerName: 'Monto',
      accessorKey: 'amount',
      cellRenderer: this.amountTemplate,
    },
    { headerName: 'Periodo', accessorKey: 'period.end_date' },
    { headerName: 'Categoría', accessorKey: 'category.name' },
    { headerName: 'Fecha', accessorKey: 'date', cellRenderer: this.dateTemplate },
    {
      headerName: 'Acciones',
      accessorKey: 'actions',
      cellRenderer: this.actionsTemplate,
    },
      ];
    })

  }

  ngOnInit(): void {
    this.filteredBills = this.bills;
    this.getCategories();
    this.getProviders();
    this.getPeriods();
    this.getBillTypes();
    this.loadBills();
    this.initializeFilters();
  }

  onSortChange(field: string) {
    if (this.sortField === field) {
      // Alterna entre ascendente y descendente si se vuelve a hacer clic en la misma columna
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Cambia a la nueva columna y establece la dirección predeterminada a ascendente
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.loadBills(); // Recarga los datos con la nueva configuración de ordenación
  }

  actionsRenderer(params: any) {
    return `
      <div class="btn-group" role="group">
        <button class="btn btn-sm btn-warning me-2" onclick="editBill(${params.data.id})">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-primary" onclick="viewBill(${params.data.id})">
          <i class="bi bi-eye"></i>
        </button>
      </div>
    `;
  }

  onPageChange = (newPage: number) => {
    this.page = newPage;
    this.loadBills();
  };

  onPageSizeChange = (newSize: number) => {
    this.size = newSize;
    this.page = 1; // Resetea a la primera página cuando cambias el tamaño
    this.loadBills();
  };

  openFormModal() {
    throw new Error('Method not implemented.');
  }

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
  // ngOnInit(): void {
  //   this.filteredBills = this.bills;
  //   this.getCategories();
  //   this.getProviders();
  //   this.getPeriods();
  //   this.getBillTypes();
  //   this.loadBills();
  //   this.initializeFilters();
  // }

  getCategories() {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categoryList = categories.map((category: any) => ({
        value: category.id,
        label: category.name,
      }));
      this.initializeFilters(); // Actualiza el filtro después de obtener datos
    });
  }

  getProviders() {
    this.providerService.getAllProviders().subscribe((providers) => {
      this.supplierList = providers.map((provider: any) => ({
        value: provider.id,
        label: provider.name,
      }));
      this.initializeFilters();
    });
  }

  getPeriods() {
    this.periodService.get().subscribe((periods) => {
      this.periodsList = periods.map((period: any) => ({
        value: period.id,
        label: `${period.month}/${period.year}`,
      }));
      this.initializeFilters();
    });
  }

  getBillTypes() {
    this.billService.getBillTypes().subscribe((types) => {
      this.typesList = types.map((type: any) => ({
        value: type.id,
        label: type.name,
      }));
      this.initializeFilters();
    });
  }

  // Initialize filter configurations
  initializeFilters(): void {
    this.filterConfig = new FilterConfigBuilder()
      .selectFilter(
        'Tipo',
        'billType.name',
        'Seleccione un tipo',
        this.typesList
      )
      .selectFilter(
        'Proveedor',
        'supplier.name',
        'Seleccione un proveedor',
        this.supplierList
      )
      // .numberFilter('Monto', 'amount', 'Ingrese el monto')
      // .dateFilter('Fecha', 'date', 'Seleccione una fecha')
      .selectFilter(
        'Categoría',
        'category.name',
        'Seleccione una categoría',
        this.categoryList
      )
      // .radioFilter('Activo', 'isActive', [
      //   { value: 'true', label: 'Activo' },
      //   { value: 'false', label: 'Inactivo' },
      //   { value: 'undefined', label: 'Todo' },
      // ])
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
  private loadBills(): void {
    this.bills = [];
    this.isLoading = true;
    const filters = this.filters.value;
    this.billService
      .getAllBillsAndPagination(
        this.page - 1,
        this.size,
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
            this.filteredBills = [...this.bills];
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
        doc.save(
          `Gastos_${this.today.getDay()}-${this.today.getMonth()}-${this.today.getFullYear()}/${this.today.getHours()}hs:${this.today.getMinutes()}min.pdf`
        );
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
