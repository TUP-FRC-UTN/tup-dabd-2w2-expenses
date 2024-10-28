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
import { CommonModule } from '@angular/common';
import { ExpensesBillsNavComponent } from '../../navs/expenses-bills-nav/expenses-bills-nav.component';
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

@Component({
  selector: 'app-list-expenses_bills',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgbModule,
    PeriodSelectComponent,
    ExpensesBillsNavComponent,
    FormsModule,
    NgPipesModule,
    CommonModule,
  ],
  templateUrl: './list-bills.component.html',
})
export class ListBillsComponent implements OnInit {
  //Lista de todos los bills
  bills: Bill[] = [];

  updatedBill: Bill | undefined;

  //Lista de bills filtradas
  filteredBills: Bill[] = [];
  //Categorias inyectadas
  billservice = inject(BillService);
  categoryService = inject(CategoryService);
  periodService = inject(PeriodService);
  providerService = inject(ProviderService);
  modal = inject(NgbModal);
  private fb = inject(FormBuilder);

  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  isLoading: boolean = false;

  totalElements: number = 0;
  //currentPage: number = 0;
  //pageSize: number = 10;
  //totalPages: number = 0;
  totalItems: number = 0;
  cantPages: number[] = [];
  indexActive = 1;

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
  categoryList: Category[] = [];
  supplierList: Provider[] = [];
  periodsList: Period[] = [];
  typesList: BillType[] = [];
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
  ngOnInit(): void {
    this.isLoading = true;
    this.loadBills();
    this.loadSelect();
  }
  // Método para cancelar la edición
  cancelEdit() {
    this.viewList = true; // Volvemos a mostrar la lista
    this.selectedBill = undefined; // Limpiamos la factura seleccionada
  }

  // Busca las bills de acuerdo a los filtros establecidos
  filterBills() {
    this.bills = [];
    const filters = this.filters.value;
    console.log(`Filtros:${filters}`);
    this.billservice
      .getAllBills(
        this.pageSize,
        this.currentPage,
        filters.selectedPeriod?.valueOf(),
        filters.selectedCategory?.valueOf(),
        filters.selectedSupplier?.valueOf(),
        filters.selectedType?.valueOf(),
        filters.selectedProvider?.valueOf().toString(),
        filters.selectedStatus?.valueOf().toString()
      )
      .subscribe({
        next: (bills) => {
          this.bills = bills;
        },
        error: (error) => {
          console.error('Error al cargar las facturas:', error);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
  //Elimina los filtros y vuelve a buscar por todos los valores disponibles
  unFilterBills() {
    //this.filters.reset();
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
        this.currentPage-1,
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
          console.log(this.totalElements,this.pageSize)
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
  updatePageSize() {
    this.currentPage = 0; // Reinicia a la primera página
    this.loadBills();
  }

  //Trae todas las categorias
  getCategories() {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categoryList = categories;
    });
  }
  //Trae todas los supplier
  getProviders() {
    this.providerService.getAllProviders().subscribe((providers) => {
      this.supplierList = providers;
    });
  }
  //Trae todas los períodos
  getPeriods() {
    this.periodService.get().subscribe((periods) => {
      this.periodsList = periods;
    });
  }
  //Trae todas los tipos de bill disponibles
  getBillTypes() {
    this.billservice.getBillTypes().subscribe((types) => {
      this.typesList = types;
    });
    console.log(`Tipos:${this.typesList}`);
  }
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

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.loadBills(); // Recargar la lista de facturas
        }
      },
      (reason) => {
        // Manejar el cierre del modal sin actualizar
      }
    );
  }
  //abre el modal de edicion por id
  showModal(title: string, message: string) {
    const modalRef = this.modalService.open(NgbModal);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
  }

  //Carga los valores en los filtros existentes
  loadSelect() {
    this.getCategories();
    this.getProviders();
    this.getPeriods();
    this.getBillTypes();
  }
  onPageChange(number: number) {
    this.currentPage = number
    this.loadBills()
  }

  //Resetea los valores del modal de edicion

  //Guarda la nueva categoría

  //Método que formatea de BillDto a entidad Bill
  private formatBills(
    billsDto$: Observable<PaginatedResponse<BillDto>>
  ): Observable<Bill[]> {
    return billsDto$.pipe(
      map((response) => {
        const billsDto = response.content;
        if (!Array.isArray(billsDto)) {
          console.error('La respuesta del servidor no contiene una array');
          return [];
        }
        return billsDto.map(
          (billDto) =>
            new Bill(
              billDto.expenditure_id,
              billDto.date,
              billDto.amount,
              billDto.description,
              billDto.supplier,
              billDto.period,
              billDto.category,
              billDto.bill_type,
              billDto.status
            )
        );
      })
    );
  }
  //Generación de documentos
  //Generación de pdf
  imprimir() {
    console.log('Imprimiendo');
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.text('Bills Report', 14, 20);

    // Llamada al servicio para obtener las expensas
    this.billservice.getAllBills(100000, 0).subscribe((bills) => {
      // Usando autoTable para agregar la tabla
      autoTable(doc, {
        startY: 30,
        head: [
          [
            'Mes',
            'Año',
            'Total Amount',
            'State',
            'Plot Number',
            'Percentage',
            'Bill Type',
          ],
        ],
        body: bills.map((bill) => [
          bill.period ? bill.period.year : null,
          bill.period ? bill.period.month : null,
          bill.amount,
          bill.date.toLocaleDateString(),
          bill.status ? bill.status : null,
          bill.supplier ? bill.supplier.name : null,
          bill.category ? bill.category.name : null,
          bill.billType ? bill.billType.name : null,
          bill.description,
        ]),
      });

      // Guardar el PDF después de agregar la tabla
      doc.save('bills_report.pdf');
      console.log('Impreso');
    });
  }

  //Generar excel con todos los fatos
  //Crear excel con datos de los gastos que se muestran
  downloadTable() {
    this.billservice.getAllBillsAndPagination(500000).subscribe((bills) => {
      // Mapear los datos a un formato tabular adecuado
      const data = bills.content.map((bill) => ({
        Periodo: `${bill?.period?.month} / ${bill?.period?.year}`,
        'Monto Total': bill.amount,
        Fecha: bill.date,
        Proveedor: bill.supplier?.name,
        Estado: bill.status,
        Categoría: bill.category,
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
}