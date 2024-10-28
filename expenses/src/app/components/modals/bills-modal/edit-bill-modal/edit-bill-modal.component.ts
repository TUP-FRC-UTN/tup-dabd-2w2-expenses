import { Component, inject, Input, OnInit, ViewChild} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Bill } from '../../../../models/bill';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProviderService } from '../../../../services/provider.service';
import { CategoryService } from '../../../../services/category.service';
import { PeriodService } from '../../../../services/period.service';
import Category from '../../../../models/category';
import Period from '../../../../models/period';
import { BillService } from '../../../../services/bill.service';
import BillType from '../../../../models/billType';
import { Provider } from '../../../../models/provider';
import { CommonModule } from '@angular/common';
import { NgModalComponent } from '../../ng-modal/ng-modal.component';

@Component({
  selector: 'app-edit-bill-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-bill-modal.component.html',
  styleUrl: './edit-bill-modal.component.css'
})
export class EditBillModalComponent implements OnInit {
  private activeModal = inject(NgbActiveModal);
  private supplierService = inject(ProviderService);
  private categoryService = inject(CategoryService);
  private periodService = inject(PeriodService);
  private billService = inject(BillService);
  private modalService = inject(NgbModal);

  newCategoryForm: FormGroup;
  @ViewChild('newCategoryModal') newCategoryModal: any;



  @Input() bill?: Bill;
  updateBill:FormGroup= new FormGroup({
    expenditureId: new FormControl(''),
    date: new FormControl(''),
    amount: new FormControl(''),
    description: new FormControl(''),
    supplier: new FormControl(''),
    period: new FormControl(''),
    category: new FormControl(''),
    billType: new FormControl(''),
    status: new FormControl('')
  })
  suppliersList: Provider[] = [];
  categoriesList: Category[] = [];
  periodsList: Period[] = [];
  billTypesList: BillType[] = [];

  constructor(){
    this.newCategoryForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl('')
    });
  }
  ngOnInit() {
    this.loadLists().then(() => {
    this.updateBill.patchValue({
      expenditureId: this.bill?.expenditureId,
      date: this.formatDate(this.bill?.date),
      amount: this.bill?.amount,
      description: this.bill?.description,
      supplier: this.bill?.supplier.id,
      period: this.bill?.period.id,
      category: this.bill?.category.category_id,
      billType: this.bill?.billType.bill_type_id,
      status: this.bill?.status
    });
  });

  }
  async loadLists(){
    try{

      this.categoryService.getAllCategories().subscribe((categories) => {
        this.categoriesList = categories
      });
      this.supplierService.getAllProviders().subscribe((suppliers) => {
        this.suppliersList = suppliers
      });
      this.periodService.get().subscribe((periods) => {
        this.periodsList = periods
      });
      this.billService.getBillTypes().subscribe((types) => {
        this.billTypesList = types
      });
    } catch (error) {
      console.error('Error al cargar las listas', error);
    }
  }


  formatDate(date?: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    // Perform validation and saving logic here if necessary
    if(this.updateBill.valid){
      console.log(`Valor de bill a actualizar:${JSON.stringify(this.updateBill.value)}`)
      const requestBill ={
        description: this.updateBill.value.description,
        amount: this.updateBill.value.amount,
        date: new Date(this.updateBill.value.date).toISOString(),
        status: this.updateBill.value.status,
        category_id: this.updateBill.value.category.category_id,
        supplier_id: this.updateBill.value.supplier.id,
        supplier_employee_type: this.bill?.supplier.name.toUpperCase(), // Assuming this is a constant value
        type_id: this.updateBill.value.billType.bill_type_id,
        period_id: this.updateBill.value.period.id,
        link_pdf:''
      }

      this.billService.updateBill(requestBill).subscribe({
        next: (response: any) => {
          console.log('Actualizado correctamente', response);
          this.showModal('Éxito', 'El gasto se ha actualizado correctamente.');
        },
        error: (error: any) => {
          console.error('Error en el post', error);
          this.showModal('Error', 'Ha ocurrido un error al actualizar el gasto. Por favor, inténtelo de nuevo.');
        }
      })
    }
    this.activeModal.close(this.bill); // Send the updated bill back
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  openNewCategoryModal() {
    this.modalService.open(this.newCategoryModal, { ariaLabelledBy: 'modal-basic-title' });
  }
  resetForm() {
    this.loadLists();
  }
  showModal(title: string, message: string) {
    const modalRef = this.modalService.open(NgModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
  }
  saveNewCategory() {
    if (this.newCategoryForm.valid) {
      let newCategory: Category = this.newCategoryForm.value;
      newCategory.name = newCategory.name?.trim();
      newCategory.description = newCategory.description?.trim();
      newCategory.is_delete = false;
      console.log(newCategory);

      this.categoryService.addCategory(newCategory).subscribe({
        next: (response: any) => {
          console.log('Añadido correctamente', response);
          this.showModal('Éxito', 'La categoria se ha añadido correctamente.');
          this.resetForm();
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
    this.modalService.dismissAll();
    this.newCategoryForm.reset();
  }
}