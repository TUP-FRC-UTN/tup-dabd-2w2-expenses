import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LiquidationExpenseService } from '../../../services/liquidation-expense.service';
import LiquidationExpense from '../../../models/liquidationExpense';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { InfoModalComponent } from '../../modals/info-modal/info-modal.component';
import { NgModalComponent } from '../../modals/ng-modal/ng-modal.component';
import { BillService } from '../../../services/bill.service';
import { Bill } from '../../../models/bill';
import { CategoryService } from '../../../services/category.service';
import { NgPipesModule } from 'ngx-pipes';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import { ConfirmAlertComponent, MainContainerComponent, TableFiltersComponent, TableComponent, Filter, SelectFilter, FilterOption, TableColumn} from 'ngx-dabd-grupo01';
import { ProviderService } from '../../../services/provider.service';
import Period from '../../../models/period';
import { EditBillModalComponent } from '../../modals/bills-modal/edit-bill-modal/edit-bill-modal.component';
import { ViewBillModalComponent } from '../../modals/bills-modal/view-bill-modal/view-bill-modal.component';

@Component({
  selector: 'app-expenses-liquidation-details',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    CommonModule,
    FormsModule,
    InfoModalComponent,
    NgModalComponent,
    NgPipesModule,
    NgbModule,
    TableComponent,
    TableFiltersComponent,
    MainContainerComponent,
    ConfirmAlertComponent
  ],
  providers: [DatePipe, NgbActiveModal],
  templateUrl: './expenses-liquidation-details.component.html',
  styleUrl: './expenses-liquidation-details.component.css',
})
export class LiquidationExpenseDetailsComponent implements OnInit {
  //
  //  Services
  //

  private readonly billsService = inject(BillService);
  private readonly categoryService = inject(CategoryService);
  private readonly supplierService = inject(ProviderService);
  private readonly billTypeService = inject(BillService);

  private modalService = inject(NgbModal);

  //
  // routing
  //

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);


  //
  // Table
  //

  isLoading: boolean = true;

  // items

  @ViewChild('amountTemplate', { static: true }) amountTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;
  @ViewChild('paidPdf', { static: true }) paidPdf!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;

  billsFiltered: Bill[] = [];
  originalBills: Bill[] = [];

  period: Period = new Period();
  fechaTitulo = '';

  columns: TableColumn[] = [];

  // filters
  isFiltering: boolean = false;
  categories: FilterOption[] = [];
  suppliers: FilterOption[] = [];
  billTypes: FilterOption[] = [];

  filterCategory: number | null = null;
  filterSupplier: number | null = null;
  filterType: number | null = null;

  filters: Filter[] = [
    new SelectFilter('Categoría', 'category', 'Seleccione la categoría', this.categories),
    new SelectFilter('Proveedor', 'supplier', 'Seleccione el proveedor', this.suppliers),
    new SelectFilter('Tipo', 'type', 'Seleccione el tipo', this.billTypes)
  ];

  // pagination
  originalTotalItems = 0;
  totalItems = 0;
  page = 0;
  size = 10;

  // other variables

  periodId: number | null = null;

  fileName = 'reporte-gastos-liquidación';


  //
  // Methods
  //

  ngOnInit(): void {
    this.fechaTitulo = ''

    this.loadLiquidationExpenseDetails();
    this.loadCategories();
    this.loadSuppliers();
    this.loadBillTypes();

    this.columns = [
      {headerName: 'Categoría', accessorKey: 'category.name'},
      {headerName: 'Tipo', accessorKey: 'billType.name'},
      {headerName: 'Fecha', accessorKey: 'date', cellRenderer: this.dateTemplate},
      {headerName: 'Proveedor', accessorKey: 'supplier.name'},
      {headerName: 'Descripción', accessorKey: 'description'},
      {headerName: 'Estado', accessorKey: 'status', cellRenderer: this.statusTemplate},
      {headerName: 'Monto', accessorKey: 'amount', cellRenderer: this.amountTemplate, align:'right'},
      {headerName: 'Acciones', accessorKey: 'actions', cellRenderer: this.actionsTemplate},
    ];
  }

  //  load lists
  private loadBillTypes() {
    this.billTypeService.getBillTypes().subscribe((data) => {
      data.forEach(e => {
        this.billTypes.push({value: e.bill_type_id.toString() ,label: e.name})
      })
    });
  }

  private loadCategories() {
    this.categoryService.getAllCategories().subscribe((data) => {
      data.forEach(e => {
        this.categories.push({value: e.category_id.toString() ,label: e.name})
      })
    });
  }

  private loadSuppliers() {
    this.supplierService.getAllProviders().subscribe((data) => {
      data.forEach(e => {
        this.suppliers.push({value: e.id.toString() ,label: e.name})
      })
    });
  }

  private loadLiquidationExpenseDetails() {
    this.route.paramMap.subscribe((params) => {
      const periodId = params.get('period_id');

      if (periodId && !isNaN(Number(periodId))) {
        this.periodId = parseInt(periodId);
      }
      this.getBills(
        this.size,
        this.page -1,
        this.periodId,
        null,
        null,
        null
      );
    });
  }

  private getBills(
    itemsPerPage: number,
    page: number,
    period: number | null,
    type: number | null,
    supplier: number | null,
    category: number | null
  ) {
    this.billsService
      .getAllBillsPaged(
        itemsPerPage,
        page,
        period,
        category,
        type,
        null,
        supplier
      )
      .subscribe((data) => {
        data.bills.subscribe(data => {
          this.billsFiltered = data
          this.originalBills = this.billsFiltered;
          this.period = this.originalBills[0].period;
          this.fechaTitulo = '| ' + this.period.month.toString() + '/' + this.period.year.toString()
          this.isLoading = false;
        })
        data.pagination.subscribe(data => {
          this.totalItems = data.totalElements
          this.originalTotalItems = this.totalItems
        });
      });
  }


  // Filter data

  filterTableByText(value: string) {
    debugger
    const filterValue = value?.toLowerCase() || '';
    if(filterValue === '') {
      this.billsFiltered = this.originalBills;
      return;
    }

    this.billsFiltered = this.originalBills.filter(bill =>
      bill.category.name.toLowerCase().includes(filterValue) ||
      bill.supplier.name.toLowerCase().includes(filterValue) ||
      bill.amount.toString().toLowerCase().includes(filterValue) ||
      bill.billType.name.toLowerCase().includes(filterValue) ||
      bill.description.toLowerCase().includes(filterValue) ||
      bill.date.toString().toLowerCase().includes(filterValue)
    );
  }

  filterTableBySelects(value: Record<string, any>) {
    debugger
    this.filterCategory = value['category']?.toLowerCase() || null;
    this.filterSupplier = value['supplier']?.toLowerCase() || null;
    this.filterType = value['type']?.toLowerCase() || null;

    if (this.filterCategory === null && this.filterSupplier === null && this.filterType === null) {
      this.billsFiltered = this.originalBills;
      this.totalItems = this.originalTotalItems
      return;
    }

    this.billsService
      .getAllBillsPaged(
        this.size,
        this.page -1,
        this.periodId,
        this.filterCategory,
        this.filterType,
        null,
        this.filterSupplier
      )
      .subscribe((data) => {
        data.bills.subscribe(data => {
          this.billsFiltered = data
          this.isFiltering = true;
        })
        data.pagination.subscribe(data => {
          this.totalItems = data.totalElements
        });
      });
  }



  // Pagination

  onPageChange = (page: number) => {
    this.page = page;
    if (this.isFiltering) {
      this.filterTableBySelects({category: this.filterCategory, supplier: this.filterSupplier ,type: this.filterType});
    } else {
      this.loadLiquidationExpenseDetails();
    }
  };

  onPageSizeChange = (size: number) => {
    this.size = size;
    this.page = 0;
    if (this.isFiltering) return;

    this.loadLiquidationExpenseDetails();
  };


  // PDF Y Excel

  downloadTable() {
    // Mapear los datos a un formato tabular adecuado
    const data = this.billsFiltered.map((bill) => ({
      Categoría: `${bill.category.name}`,
      Tipo: `${bill.billType.name}`,
      Fecha: `${bill.date}`,
      Proveedor: `${bill.supplier.name}`,
      Monto: `${bill.amount}`,
      Descripción: `${bill.description}`,
    }));

    const fecha = new Date();
    console.log(fecha);
    const finalFileName =
      this.fileName + '-' + moment(fecha).format('DD-MM-YYYY_HH-mm');

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Gastos de Liquidación');
    XLSX.writeFile(wb, `${finalFileName}.xlsx`);

  }

  imprimir() {
    console.log('Imprimiendo');
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.text('Reporte de Gastos de Liquidación', 14, 20);

    // Usando autoTable para agregar la tabla
    autoTable(doc, {
      startY: 30,
      head: [['Categoría', 'Tipo','Fecha', 'Proveedor', 'Monto', 'Descripcion']],
      body: this.billsFiltered.map((bill) => [
        bill.category?.name || 'N/A',
        bill.billType?.name || 'N/A',
        bill.date instanceof Date
          ? bill.date.toLocaleDateString()
          : new Date(bill.date).toLocaleDateString() || 'N/A',
        bill.supplier?.name || 'N/A',
        bill?.amount?.toLocaleString('es-AR', {
          style: 'currency',
          currency: 'ARS',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) || 'N/A',
        bill?.description || 'N/A',
      ]),
    });

    // Guardar el PDF después de agregar la tabla
    const fecha = new Date();
    console.log(fecha);
    const finalFileName =
      this.fileName +
      '-' +
      moment(fecha).format('DD-MM-YYYY_HH-mm') +
      '.pdf';
    doc.save(finalFileName);
    console.log('Impreso');
  }



  // Modals

  showModal() {
    const modalRef = this.modalService.open(ConfirmAlertComponent);

    modalRef.componentInstance.alertTitle = 'Acerca de Gastos de expensa'
    modalRef.componentInstance.alertMessage =
      'En esta pantalla se desplliegan los gastos de la expensa previamente seleccionada. Los gastos puede ser filtrada tanto por categoría o por sus proveedores y presentan botones para ver la factura del pago o para editarla.';
    modalRef.componentInstance.alertType = 'info';
  }

  showPaidModal(item: Bill) {
    this.openViewModal(item);
  }

  openViewModal(bill: Bill) {
    const modalRef = this.modalService.open(ViewBillModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.bill = bill;
  }
  
  //  Pther buttons
  edit(bill: Bill) {
    this.openEditModal(bill);
  }

  openEditModal(bill: Bill) {
    const modalRef = this.modalService.open(EditBillModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.bill = bill;

    modalRef.result.then((result) => {
      if (result === 'updated') {
        this.loadLiquidationExpenseDetails();
      }
    });
  }

}
