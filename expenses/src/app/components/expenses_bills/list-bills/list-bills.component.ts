import { Component, inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { Bill } from '../../../models/bill';
import { BillService } from '../../../services/bill.service';
import Period from '../../../models/period'
import { Provider } from '../../../models/provider';
import Category from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { ProviderService } from '../../../services/provider.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PeriodService } from '../../../services/period.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import BillType from '../../../models/billType';
import { AsyncPipe, NgClass } from '@angular/common';
import {ExpensesBillsNavComponent} from "../../navs/expenses-bills-nav/expenses-bills-nav.component";
import { PeriodSelectComponent } from '../../selects/period-select/period-select.component';
import { PaginatedResponse } from '../../../models/paginatedResponse';
import { BillDto } from '../../../models/billDto';
import { map, Observable } from 'rxjs';


@Component({
  selector: 'app-list-expenses_bills',
  standalone: true,
  imports: [ReactiveFormsModule, PeriodSelectComponent, ExpensesBillsNavComponent],
  templateUrl: './list-bills.component.html',
  styleUrl: './list-bills.component.css'
})
export class ListBillsComponent implements OnInit {
loadSelect() {
throw new Error('Method not implemented.');
}
  
  //Lista de todos los bills
  bills: Bill[] = [];

  //Respuesta de la api
  billsWithPages? : PaginatedResponse<BillDto>;
  //Lista de bills filtradas
  filteredBills: Bill[] = [];
  //Categorias inyectadas
  billservice = inject(BillService);
  categoryService = inject(CategoryService);
  periodService = inject(PeriodService);
  providerService = inject(ProviderService);
  modal = inject(NgbModal)
  private fb = inject(FormBuilder);

  //Atributos
    //Lista de categorias

  categoryList: Category[] = [];
    //Filtros para buscar el objeto
  filters = new FormGroup({
    
    selectedCategory: new FormControl(0),
    selectedPeriod: new FormControl(0),
    selectedSupplier: new FormControl(0),
  })
  //
  providersList: Provider[] = [];
  periodsList: Period[] = [];
  typesList:BillType[] = [];

  viewList: boolean= true;
  categoryEnable:boolean = true;
  enabelingUpdate : boolean = false;
  billForm : FormGroup;
  selectedBill: Bill | undefined;
  private modalService = inject(NgbModal);
  newCategoryForm: FormGroup;
  @ViewChild('newCategoryModal') newCategoryModal: any;

  constructor(){
    this.billForm = this.fb.group({
      category_id: ['', Validators.required],
      description: [''],
      amount: ['', [Validators.required, Validators.min(0.0001)]],
      date: ['', Validators.required],
      supplierId: ['', [Validators.required]],
      typeId: ['', [Validators.required]],
      periodId: ['', [Validators.required]],
      status: ['ACTIVE', Validators.required]
    });
    this.newCategoryForm = this.fb.group({
      name: ['', [Validators.required,
                  Validators.minLength(2)
      ]],
      description: ['', [Validators.required,
                        Validators.minLength(2)
      ]]
    });
    
    this.billservice.getAllBillsAndPagination().subscribe(response=>{
      this.billsWithPages= response
    })

  }

  ngOnInit(): void {
    this.loadBills();
    this.getCategories();
    this.getProviders();
    this.getPeriods();

  }

  viewBill(bill:Bill){
    this.selectedBill = bill;
    this.billForm.patchValue({
      categoryId: bill.category?.category_id,
      description:bill.description,
      amount: bill.amount,
      date: bill.date,
      supplier_id: bill.supplier?.id,
      type_id: bill.billType?.bill_type_id,
      period_id: bill.period?.id,
      status: bill.status
    })
    if(bill.status === "Cancelado"){
      this.enabelingUpdate = false;
    }
    this.viewList = false;
  }

  saveBill() {
    if (this.billForm.valid) {
      const updatedBill = { ...this.selectedBill, ...this.billForm.value };
      this.billservice.updateBill(updatedBill).subscribe(() => {
        this.loadBills();
        this.disableUpdate();
        this.viewList = true;
        this.selectedBill = undefined;
      });
    }
  }

  // Método para cancelar la edición
  cancelEdit() {
    this.viewList = true; // Volvemos a mostrar la lista
    this.selectedBill = undefined; // Limpiamos la factura seleccionada
  }

  // Busca las bills de acuerdo a los filtros establecidos
  filterBills() {
    const filters = this.filters.value;
    this.billservice.getAllBills().subscribe((bill)=>{
      this.bills= bill
    })

    
  }
  //Elimina los filtros y vuelve a buscar por todos los valores disponibles
  unFilterBills(){
    this.loadBills()
  }

  openUpdateModal(bill?: Bill) {
    return null
  }
  //Primer llamado, trae todos los bills que hay
  loadBills() {
    this.billservice.getAllBills().subscribe((bills) => {
      this.bills = bills;
    })
    console.log(this.bills);

    this.billservice.getAllBillsAndPagination().subscribe((response)=>{
      response.content.forEach((billDto)=>{

      })
    })
  }
  //Trae todas las categorias
  getCategories() {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categoryList = categories
    })
  }
  //Trae todas los supplier
  getProviders() {
    this.providerService.getAllProviders().subscribe((providers) => {
      this.providersList = providers
    })
  }
  //Trae todas los períodos
  getPeriods() {
    this.periodService.get().subscribe((periods) => {
      this.periodsList = periods
    })
  }
  //Trae todas los tipos de bill que hay
  getBillTypes(){
    this.billservice.getBillTypes().subscribe((types)=>{
      this.typesList= types
    })
  }
  //inhabilita los campos del modal de edicion
  disableUpdate(){
    this.billForm.disable();
    this.categoryEnable = false;
  }
  //habilita los campos del modal de edicion
  enableUpdate(){
    this.billForm.enable();
    this.categoryEnable = true;
  }
  //Abre el modal de confirmacion de borrado
  openDeleteModal(id?: number) {
    return null
  }
  //abre el modal de edicion por id
  showModal(title: string, message: string) {
    const modalRef = this.modalService.open(NgbModal);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
  }
  //Abre el modal para agregar una categoría
  openNewCategoryModal() {
    this.modalService.open(this.newCategoryModal, { ariaLabelledBy: 'modal-basic-title' });
  }
  //Carga los valores en los filtros existentes
  loadSelectOptions() {
    this.getCategories();
    this.getProviders();
    this.getPeriods();
    this.getBillTypes();
  }
  //Resetea los valores del modal de edicion
  resetForm() {
    this.billForm.reset();
    this.loadSelectOptions();
    this.disableUpdate();
    this.viewList=true;
  }
  //Guarda la nueva categoría
  saveNewCategory() {
    if (this.newCategoryForm.valid) {
      let newCategory: Category = this.newCategoryForm.value;
      newCategory.name = newCategory.name?.trim();
      newCategory.description = newCategory.description?.trim();
      console.log(newCategory);

      this.categoryService.addCategory(newCategory).subscribe({
        next: (response: any) => {
          console.log('Añadido correctamente', response);
          this.showModal('Éxito', 'La categoria se ha añadido correctamente.');
          this.getCategories();
        },
        error: (error: any) => {
          console.error('Error en el post', error);
          if (error.status === 409) {
            this.showModal('Error', 'Ya existe una categoría con este nombre. Por favor, elija un nombre diferente.');
          } else {
            this.showModal('Error', 'Ha ocurrido un error al añadir la categoría. Por favor, inténtelo de nuevo.');
          }
        }
      });
    } else {
      console.log('Formulario inválido');
      this.showModal('Error', 'Por favor, complete todos los campos requeridos correctamente.');
    }
    // console.log('Nueva categoría:', this.newCategoryForm.value);
    //cerrar el modal y actualiza la lista de categorías
    this.modalService.dismissAll();
    this.newCategoryForm.reset();
  }

  private formatBills(billsDto$: Observable<PaginatedResponse<BillDto>>): Observable<Bill[]> {
    return billsDto$.pipe(

      map((response)=>{
        const billsDto = response.content;
        if(!Array.isArray(billsDto)){
          console.error('La respuesta del servidor no contiene una array')
          return []
        }
        return billsDto.map((billDto)=>
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
        )
      })
    );
  }
}
