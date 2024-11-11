import {AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
// import Category from "../../../models/category";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgPipesModule} from "ngx-pipes";
// import {CategoryService} from "../../../services/category.service";
// import {NewCategoryModalComponent} from "../../modals/bills/new-category-modal/new-category-modal.component";
import {
  NgbDropdownModule,
  NgbModal
} from "@ng-bootstrap/ng-bootstrap";
import {ActivationEnd, Router, RouterLink} from "@angular/router";
//import {CategoryBillInfoComponent} from "../../modals/info/category-bill-info/category-bill-info.component";
import {
  Filter, FilterConfigBuilder,
  MainContainerComponent,
  TableColumn,
  TableComponent,
  TableFiltersComponent,
  ToastService
} from "ngx-dabd-grupo01";
import {AsyncPipe, CommonModule, DatePipe} from "@angular/common";
import * as XLSX from 'xlsx';
import moment from "moment/moment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ChargeService } from '../../../services/charge.service';
import { CategoryCharge, ChargeType } from '../../../models/charge';
import { EditCategoryModalComponent } from '../../modals/charges/category/edit-categoryCharge-modal/edit-categoryCharge-modal.component';
import { DeleteCategoryModalComponent } from '../../modals/charges/category/delete-categoryCharge-modal/delete-categoryCharge-modal.component';
import { NewCategoryChargeModalComponent } from '../../modals/charges/category/new-categoryCharge-modal/new-categoryCharge-modal.component';
import { ExpensesModalComponent } from '../../modals/expenses-modal/expenses-modal.component';

@Component({
  selector: 'app-expenses-list-category-charges',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    NgPipesModule,        
    MainContainerComponent,
    TableFiltersComponent
  ],
  providers: [DatePipe],
  templateUrl: './expenses-list-categorycharge.component.html',
  styleUrl: './expenses-list-categorycharge.component.css'
})
export class ExpensesListCategoryChargesComponent {
getStatusBadgeClass(arg0: string) {
throw new Error('Method not implemented.');
}

  //SERVICES
  private toastServices = inject(ToastService);
  private chargesServices = inject(ChargeService);
  private modalService = inject(NgbModal);
  private readonly router = inject(Router);
  //PROPERTIES
  categories : CategoryCharge[] = [];
  //categorySelected: CategoryCharge = undefined;
  categoryChargeId : number = 0;

  //PROPERTIES DE PAGINATION
  totalElements: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;
  cantPages: number[] = [];
  indexActive = 1;

  //PROPERTIES
  searchTerm = '';
  fileName: string = 'reporte-categorias-cargos';




  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  // PAGINATION PROPERTIES
  // totalItems = 0;
  // page = 0;
  // size = 10;
  sortField = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  searchParams: { [key: string]: any } = {};
  // TABLE PROPERTIES
  //searchTerm = '';
  isLoading = false;
  //categories: CategoryCharge[] = [];
  columns: TableColumn[] = [];
  // fileName: string = 'reporte-categorias-cargos';
  chargeTypes : ChargeType[] = [ChargeType.ABSOLUTE,ChargeType.PERCENTAGE,ChargeType.NEGATIVE];
  categoryStatus : string[] = ['1','','true','false'];
  selectedStatus: boolean | null = null;
  excluingFines : boolean | null = null;
  TypeAmount : ChargeType | null = null;
   // Métodos de Filtro y Paginación
  //#region FILTER OPERATIONS
  applyFilters() {
    this.currentPage = 0;
    this.cargarPaginado();
  }

  clearFilters() {
    this.TypeAmount = null;
    this.selectedStatus = null;
    this.excluingFines = null;
    this.cargarPaginado();
    this.searchTerm = '';
  }
  filters : Filter[]= [];
  
  filterConfig: Filter[] = new FilterConfigBuilder()
    .selectFilter(
      'Estado',
      'isDeleted',
      'Seleccione el Estado',[
        ...this.categoryStatus.map(status => ({
          value: status,
          label: status === 'true' ? 'Activo' : status === 'false' ? 'Inactivo' : 'Todos',
        }))
      ]
    )
    .selectFilter('Tipo de Cargo','chargeType','Seleccione un tipo', this.chargeTypes.map(type => ({
      value : type,
      label : type.toString()
    })))
    .radioFilter('Incuye Multas', 'includeFine', [
      { value: 'false', label: 'Si' },
      { value: 'true', label: 'No' },
    ])
    .build()

  onFilterValueChange(filters: Record<string, any>) {
    this.searchParams = {
      ...filters
    };

    this.pageSize = 0;
    this.loadCategories();
  }

  // Handlers for pagination Manejo por Paginación
  onPageChange = (page: number) => {
    this.pageSize = (page);
    this.loadCategories();
  };

  onPageSizeChange = (size: number) => {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadCategories();
  };

  ngOnInit(): void {
    this.searchParams = { 'isDeleted':'false' };
    this.cargarPaginado();
    //this.loadCategories();
  }

  loadCategories(){
    this.chargesServices.getCategoryCharges().subscribe((data)=>{
      this.categories = data;
      
    })
  }

  cargarPaginado() {
    const status = this.selectedStatus || undefined;
    const type = this.TypeAmount || undefined //this.getChargeType(this.TypeAmount);
    const excluingFines = this.excluingFines || false ;
    debugger
    console.log('El tipo es ' + type)
    this.chargesServices
      .getCategoryChargesPagination(this.currentPage, this.pageSize, type!, status!, excluingFines)
      .subscribe((response) => {
        debugger
        this.categories = response.content;
        this.categories = this.keysToCamel(this.categories) as CategoryCharge[]; //Cambiar de snake_Case a camelCase       
        console.log('Categoria en : '+ this.categories);
        this.totalPages = response.totalPages;
        this.totalItems = response.totalElements;
        this.currentPage = response.number;        
      });
    console.log(this.categories);
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

  isFine(name :String){    
    return name.toLowerCase().includes("multa");
  }


  onSearchValueChange(searchTerm: string) {
    this.searchParams['searchTerm'] = searchTerm;
    this.currentPage = 0;
    this.loadCategories();
  }

  changesPageSize(newRowsPerPage: number) {
    this.currentPage = 0;
    this.pageSize = newRowsPerPage;
    this.cargarPaginado();
  }

  openFormModal() {
    const modalRef = this.modalService.open(NewCategoryChargeModalComponent);
    modalRef.result.then(
      (result) => {
        if (result.success) {
          this.toastServices.sendSuccess(result.message)
          this.loadCategories();
        } else {
          this.toastServices.sendError(result.message)
        }
      }
    );
  }

  deleteCategory(category: CategoryCharge) {
    const modalRef = this.modalService.open(DeleteCategoryModalComponent, {
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.category = category;
    modalRef.result.then(
      (result) => {
        if (result.success) {
          this.toastServices.sendSuccess(result.message)
          window.location.reload();
          // this.loadCategories();
        } else {
          this.toastServices.sendError(result.message)
        }
      }
    );
  }

  addCategory() {
    const modalRef = this.modalService.open(NewCategoryChargeModalComponent);
    modalRef.result.then(
      (result) => {
        if (result.success) {
          this.toastServices.sendSuccess(result.message)
          this.loadCategories();
        } else {
          this.toastServices.sendError(result.message)
        }
      }
    );
  }

  editCategory(category: CategoryCharge) {
    const modalRef = this.modalService.open(EditCategoryModalComponent);
    modalRef.componentInstance.category = category;
    modalRef.result.then(
      (result) => {
        if (result.success) {
          this.toastServices.sendSuccess(result.message)
          this.loadCategories();
        } else {
          this.toastServices.sendError(result.message)
        }
      }
    );
  }


  showInfo(): void {
    /*this.modalService.open(, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      centered: true,
      scrollable: true
    });*/
  }

  downloadTable() {
    const status = this.selectedStatus || undefined;
    const type = this.TypeAmount || undefined //this.getChargeType(this.TypeAmount);
    const excluingFines = this.excluingFines || false ;
    this.chargesServices.getCategoryChargesPagination(0,this.totalItems,type,status,excluingFines)
      .subscribe(categories =>
        {
          // Mapear los datos a un formato tabular adecuado
          const data = categories.content.map(category => ({
            'Nombre': category.name,
            'Descripcion': category.description,
            'Tipo de valor': category.amountSing,
            'Estado': category.active
          }));
          const fecha = new Date();
          const finalName = this.fileName + '-' + moment(fecha).format("DD-MM-YYYY_HH-mm");
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Categorias de Cargos');
          XLSX.writeFile(wb, `${finalName}.xlsx`);
        }
      )
  }

  imprimirPDF() {
    const status = this.selectedStatus || undefined;
    const type = this.TypeAmount || undefined //this.getChargeType(this.TypeAmount);
    const excluingFines = this.excluingFines || false ;
    let doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Categorias de cargos', 14, 20);
    this.chargesServices.getCategoryChargesPagination(0,this.totalItems,type,status,excluingFines)
      .subscribe(categories => {
        // Usando autoTable para agregar la tabla
        autoTable(doc, {
          startY: 30,
          head: [['Nombre', 'Descripcion','Tipo de Valor','Estado']],
          body: categories.content.map(category => [
            category.name,
            category.description,
            category.amountSing,
            category.active
            ]
          ),
        });
        // Guardar el PDF después de agregar la tabla
        const fecha = new Date();
        const finalFileName = this.fileName + "-" + moment(fecha).format("DD-MM-YYYY_HH-mm") +".pdf";
        doc.save(finalFileName);
      });

  }

  getChargeType(value: string): ChargeType | undefined { 
    const entry = Object.entries(ChargeType).find(([_, v]) => v === value);
    return entry ? ChargeType[entry[0] as keyof typeof ChargeType] : undefined;
}

openViewModal(category: CategoryCharge) {
  const modalRef = this.modalService.open(ExpensesModalComponent, {
    size: 'lg' // 'lg' para grande o 'xl' para extra grande
  });
  modalRef.componentInstance.charge = category;
  
}

openDeleteModal(category: CategoryCharge) {
  const modalRef = this.modalService.open(DeleteCategoryModalComponent);
  modalRef.componentInstance.category = category;

  modalRef.result.then(
    (result) => {
      if (result.success) {
        this.toastServices.sendSuccess(result.message)
        //window.location.reload();
        this.cargarPaginado();
        // this.loadCategories();
      } else {
        this.toastServices.sendError(result.message)
      }
    },
    () => {}
  );
}

filterChange(event: Record<string, any>) {
    
  // Actualizar las variables de filtro
  this.selectedStatus = event['isDeleted'] || null;
  this.excluingFines = event['includeFine'] || false
  this.TypeAmount = event['chargeType'] || null;
  console.log('El tipo es' + this.TypeAmount)
  this.cargarPaginado();
}

openUpdateModal(category: CategoryCharge) {
    const modalRef = this.modalService.open(EditCategoryModalComponent, {
      size: 'lg' // 'lg' para grande o 'xl' para extra grande
    });
    modalRef.componentInstance.category = category;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.currentPage = 0;
          this.cargarPaginado();
          this.toastServices.sendSuccess(
            'Se ha actualizado la categoria correctamente'
          );
        }
      },
      () => {}
    );
  }

}
