import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalLiquidationDetailComponent } from './modal-liquidation-detail/modal-liquidation-detail.component';
import { LiquidationExpenseService } from '../../../services/liquidation-expense.service';
import LiquidationExpense from '../../../models/liquidationExpense';
import { FormsModule } from '@angular/forms';
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
import { TablePagination, ConfirmAlertComponent, MainContainerComponent, TableFiltersComponent, TableComponent, Filter, SelectFilter, FilterOption, TableColumn} from 'ngx-dabd-grupo01';
import { ProviderService } from '../../../services/provider.service';

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
    ConfirmAlertComponent,
  ],
  providers: [DatePipe, NgbActiveModal],
  templateUrl: './expenses-liquidation-details.component.html',
  styleUrl: './expenses-liquidation-details.component.css',
})
export class LiquidationExpenseDetailsComponent implements OnInit {
  //
  //  Services
  //

  private readonly service = inject(LiquidationExpenseService);
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

  // back data
  liquidationExpense: LiquidationExpense = new LiquidationExpense();

  // items
  billsFiltered: Bill[] = [];
  originalBills: Bill[] = [];
  columns: TableColumn[] = [
    {headerName: 'Categoría', accessorKey: 'category.name'},
    {headerName: 'Tipo', accessorKey: 'billType.name'},
    {headerName: 'Fecha', accessorKey: 'date'},
    {headerName: 'Proveedor', accessorKey: 'supplier.name'},
    {headerName: 'Descripción', accessorKey: 'description'},
    {headerName: 'Monto', accessorKey: 'amount'},
  ];

  // filters
  categories: FilterOption[] = [];
  suppliers: FilterOption[] = [];
  billTypes: FilterOption[] = [];

  filters: Filter[] = [
    new SelectFilter('Categoría', 'category', 'Seleccione la categoría', this.categories),
    new SelectFilter('Proveedor', 'supplier', 'Seleccione el proveedor', this.suppliers),
    new SelectFilter('Tipo', 'type', 'Seleccione el tipo', this.billTypes)
  ];

  // pagination
  cantPages: number = 10;
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  pages: number[] = [];
  tablePagination: TablePagination = {
    totalItems: this.totalItems,
    page: this.currentPage,
    size: this.itemsPerPage,

    onPageChange: function (page: number): void {
      throw new Error('Function not implemented.');
    },
    onPageSizeChange: function (itemsPerPage: number): void {
      throw new Error('Function not implemented.');
    }
  };

  // other variables

  id:number|null=null
  category: number | null = null;
  period: number | null = null;
  type: number | undefined = undefined;
  typeFilter: string = '';
  searchTerm: string = '';

  fileName = 'reporte-gastos-liquidación';


  //
  // Methods
  //

  ngOnInit(): void {
    this.loadLiquidationExpenseDetails();
    this.loadCategories();
    this.loadSuppliers();
    this.loadBillTypes();
  }

  //  load lists
  private loadBillTypes() {
    this.billTypeService.getBillTypes().subscribe((data) => {
      data.forEach(e => {
        this.billTypes.push({value: e.name ,label: e.name})
      })
    });
  }

  private loadCategories() {
    this.categoryService.getAllCategories().subscribe((data) => {
      data.forEach(e => {
        this.categories.push({value: e.name ,label: e.name})
      })
    });
  }

  private loadSuppliers() {
    this.supplierService.getAllProviders().subscribe((data) => {
      data.forEach(e => {
        this.suppliers.push({value: e.name ,label: e.name})
      })
    });
  }

  private loadLiquidationExpenseDetails() {
    this.route.paramMap.subscribe((params) => {
      const periodId = params.get('period_id');
      const id = params.get('id');
      const category = params.get('categoria');
      if (!category || category == '0') {
        this.category = null;
      } else {
        this.category = Number(category);
      }

      if (id && !isNaN(Number(id))) {
        this.id = Number(params.get('id')) ;
        this.service
          .getById(Number(id))
          .subscribe((data: LiquidationExpense) => {
            this.liquidationExpense = data;
            this.type = data.bill_type?.bill_type_id;

            if (periodId && !isNaN(Number(periodId))) {
              this.period = parseInt(periodId);
            }
            this.getBills(
              this.itemsPerPage,
              this.currentPage
            );
          });
      }
    });
  }

  private getBills(
    itemsPerPage: number,
    page: number
  ) {
    this.billsService
      .getAllBillsPaged(
        itemsPerPage,
        page - 1,
        null,
        null,
        null,
        null
      )
      .subscribe((data) => {
        this.billsFiltered = data;
        this.originalBills = this.billsFiltered;
        this.cantPages = data.length;
      });
  }


  // Filter data

  filterTableByText(value: string) {
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

    const filter1 = value['category']?.toLowerCase() || '';
    const filter2 = value['supplier']?.toLowerCase() || '';
    const filter3 = value['type']?.toLowerCase() || '';

    if (filter1 === '' && filter2 === '' && filter3 === '') {
      this.billsFiltered = this.originalBills;
      return;
    }

    this.billsFiltered = this.originalBills.filter(bill => {
        const matchesFilter1 = filter1
            ? bill.category.name.toLowerCase().includes(filter1)
            : true;

        const matchesFilter2 = filter2
            ? bill.supplier.name.toLowerCase().includes(filter2)
            : true;

        const matchesFilter3 = filter3
        ? (filter3.startsWith("ex")
            ? bill.billType.name.toLowerCase().includes(filter3.toLowerCase())
            : !bill.billType.name.toLowerCase().startsWith("ex") &&
              bill.billType.name.toLowerCase().includes(filter3.toLowerCase())
        )
        : true;

        return matchesFilter1 && matchesFilter2 && matchesFilter3;
    });
}


  handleCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = +selectElement.value;
    this.category = selectedId;

    this.router.navigate([`periodo/${this.period}/liquidacion/${this.id}/${selectedId}`]);
  }


  // Pagination

  initializePagination() {
    this.totalItems =
    this.liquidationExpense.liquidation_expenses_details.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
    this.getBills(
      this.itemsPerPage,
      this.currentPage
    );
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.initializePagination();
  }


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

  openModal() {
    const modalRef = this.modalService.open(ModalLiquidationDetailComponent);
  }

  showModal(content: TemplateRef<any>) {
    const modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }


  //  Pther buttons
  edit(id: number | null) {
    console.log(id);

    if (id == null) return;
    this.router.navigate([`gastos/modificar/${id}`]);
  }

}
