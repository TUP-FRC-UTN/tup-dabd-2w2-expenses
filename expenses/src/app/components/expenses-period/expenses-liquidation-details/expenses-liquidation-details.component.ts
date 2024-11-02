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
import Category from '../../../models/category';
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
  private readonly supplierService = inject(ProviderService)

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
  bills: Bill[] = [];

  // items
  billsFiltered: Bill[] = this.bills;
  columns: TableColumn[] = [
    {headerName: 'Categoría', accessorKey: 'category.name'},
    {headerName: 'Fecha', accessorKey: 'date'},
    {headerName: 'Proveedor', accessorKey: 'supplier.name'},
    {headerName: 'Descripción', accessorKey: 'description'},
    {headerName: 'Monto', accessorKey: 'amount'}]
    ;

  // filters
  categories: FilterOption[] = [];
  suppliers: FilterOption[] = [];

  filters: Filter[] = [
    new SelectFilter('Categoría', 'category', 'Seleccione la categoría', this.categories),
    new SelectFilter('Proveedor', 'supplier', 'Seleccione el proveedor', this.suppliers)
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
  }

  //  load lists
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
              this.currentPage,
              this.period,
              this.category,
              this.type,
              'ACTIVE'
            );
          });
      }
    });
  }

  private getBills(
    itemsPerPage: number,
    page: number,
    period: number | null,
    category: number | null,
    type: number | undefined,
    status: string
  ) {
    if (type != undefined) {
      this.billsService
        .getAllBillsPaged(
          itemsPerPage,
          page - 1,
          period,
          category,
          type,
          status
        )
        .subscribe((data) => {
          this.bills = data.content;
          this.cantPages = data.totalElements;
        });
    } else console.log('No hay un tipo de expensa definido');
  }


  // Filter data

  filterTable(value: string) {
    const filterValue = value?.toLowerCase() || '';
    if(filterValue == '') {
      this.billsFiltered = this.bills;
      return;
    }

    this.billsFiltered = this.bills.filter(bill =>
      bill.category.name.toLowerCase().includes(filterValue) ||
      bill.supplier.name.toLowerCase().includes(filterValue) ||
      bill.amount.toString().toLowerCase().includes(filterValue) ||
      bill.billType?.name.toLowerCase().includes(filterValue) ||
      bill.description.toLowerCase().includes(filterValue) ||
      bill.date.toString().toLowerCase().includes(filterValue)
    );
  }

  handleCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = +selectElement.value;
    this.category = selectedId;
    console.log(selectedId);
    this.router.navigate([`periodo/${this.period}/liquidacion/${this.id}/${selectedId}`]);
  }

  clean () {
    this.billsFiltered = this.bills;
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
      this.currentPage,
      this.period,
      this.category,
      this.type,
      'ACTIVE'
    );
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.initializePagination();
  }


  // PDF Y Excel

  downloadTable() {
    this.billsService
      .getAllBillsPaged(
        this.itemsPerPage,
        this.currentPage - 1,
        this.period,
        this.category,
        this.type || null,
        'ACTIVE'
      )
      .subscribe((bill) => {
        // Mapear los datos a un formato tabular adecuado
        const data = bill.content.map((bill) => ({
          Categoría: `${bill.category.name}`,
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
      });
  }

  imprimir() {
    console.log('Imprimiendo');
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.text('Reporte de Gastos de Liquidación', 14, 20);

    // Llamada al servicio para obtener las expensas
    this.billsService
      .getAllBillsPaged(
        this.itemsPerPage,
        this.currentPage - 1,
        this.period,
        this.category,
        this.type || null,
        'ACTIVE'
      )
      .subscribe((bill) => {
        // Usando autoTable para agregar la tabla
        autoTable(doc, {
          startY: 30,
          head: [['Categoría', 'Fecha', 'Proveedor', 'Monto', 'Descripcion']],
          body: bill.content.map((bill) => [
            bill.category?.name || 'N/A',
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
      });
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
