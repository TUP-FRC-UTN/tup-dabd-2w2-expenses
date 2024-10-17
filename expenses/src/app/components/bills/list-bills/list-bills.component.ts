import { Component, inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { Bill } from '../../../models/bill';
import { BillService } from '../../../services/bill.service';
import Period from '../../../models/period'
import { Provider } from '../../../models/provider';
import Category from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { ProviderService } from '../../../services/provider.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PeriodService } from '../../../services/period.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import BillType from '../../../models/billType';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-list-bills',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, AsyncPipe],
  templateUrl: './list-bills.component.html',
  styleUrl: './list-bills.component.css'
})
export class ListBillsComponent implements OnInit {

  bills: Bill[] = [];
  filteredBills: Bill[] = [];
  billservice = inject(BillService);
  categoryService = inject(CategoryService);
  periodService = inject(PeriodService);
  providerService = inject(ProviderService);
  modal = inject(NgbModal)
  private fb = inject(FormBuilder);
  categoryList: Category[] = [];
  selectedCategory: Category = new Category();
  providersList: Provider[] = [];
  selectedProvider: Provider = new Provider();
  periodsList: Period[] = [];
  selectedPeriod: Period = new Period();
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
      supplier_id: ['', [Validators.required]],
      type_id: ['', [Validators.required]],
      period_id: ['', [Validators.required]],
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
      category_id: bill.category.category_id,
      description:bill.description,
      amount: bill.amount,
      date: bill.date,
      supplier_id: bill.supplier.id,
      type_id: bill.bill_type.bill_type_id,
      period_id: bill.period.id,
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


  filterBills() {
    console.log(JSON.stringify(this.selectedPeriod.month))
    console.log(JSON.stringify(this.selectedProvider))
    console.log(JSON.stringify(this.selectedCategory))
    this.filteredBills = this.filteredBills.filter((bill) => {
      const matchesPeriod = this.selectedPeriod && this.selectedPeriod.id ? (bill.period.month === this.selectedPeriod.month && bill.period.year === this.selectedPeriod.year) : true;
      const matchesProvider = this.selectedProvider && this.selectedProvider.id ? (bill.supplier.id === this.selectedProvider.id) : true;
      const matchesCategory = this.selectedCategory && this.selectedCategory.category_id ? (bill.category.category_id === this.selectedCategory.category_id) : true;

      return matchesPeriod && matchesProvider && matchesCategory
    })
  }

  unFilterBills(){
    this.filteredBills=[...this.bills]
    this.selectedCategory = new Category();
    this.selectedPeriod= new Period();
    this.selectedProvider= new Provider();
  }

  openUpdateModal(bill: Bill) {
    return null
  }

  loadBills() {
    this.billservice.getAllBills().subscribe((bills) => {
      this.bills = bills;
      this.filteredBills = bills
    })
    console.log(this.bills);
  }
  getCategories() {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categoryList = categories
    })
  }
  getProviders() {
    this.providerService.getAllProviders().subscribe((providers) => {
      this.providersList = providers
    })
  }

  getPeriods() {
    this.periodService.get().subscribe((periods) => {
      this.periodsList = periods
    })
  }

  getBillTypes(){
    this.billservice.getBillTypes().subscribe((types)=>{
      this.typesList= types
    })
  }
  disableUpdate(){
    this.billForm.disable();
    this.categoryEnable = false;
  }
  enableUpdate(){
    this.billForm.enable();
    this.categoryEnable = true;
  }
  openDeleteModal(id: number) {
    return null
  }
  showModal(title: string, message: string) {
    const modalRef = this.modalService.open(NgbModal);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
  }

  openNewCategoryModal() {
    this.modalService.open(this.newCategoryModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  loadSelectOptions() {
    this.getCategories();
    this.getProviders();
    this.getPeriods();
    this.getBillTypes();
  }

  resetForm() {
    this.billForm.reset();
    this.loadSelectOptions();
    this.disableUpdate();
    this.viewList=true;
  }
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
}
