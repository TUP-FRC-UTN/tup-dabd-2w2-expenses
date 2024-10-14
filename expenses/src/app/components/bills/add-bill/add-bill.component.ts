import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { BillPostRequest } from '../../../models/bill-post-request';
import {Observable} from "rxjs";
import Category from "../../../models/category";
import Period from "../../../models/period";
import {Provider} from "../../../models/provider";
import {CategoryService} from "../../../services/category.service";
import {ProviderService} from "../../../services/provider.service";
import {PeriodService} from "../../../services/period.service";
import {BillService} from "../../../services/bill.service";
import {AsyncPipe, NgClass} from "@angular/common";
import BillType from "../../../models/billType";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgModalComponent} from "../../utilities/ng-modal/ng-modal.component";


@Component({
  selector: 'app-add-bill',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, AsyncPipe, NgClass],
  templateUrl: './add-bill.component.html',
  styleUrl: './add-bill.component.css'
})
export class AddBillComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private providerService = inject(ProviderService);
  private periodService = inject(PeriodService);
  private billService = inject(BillService);
  private modalService = inject(NgbModal);
  billForm: FormGroup;
  newCategoryForm: FormGroup;
  @ViewChild('newCategoryModal') newCategoryModal: any;

  categories: Observable<Category[]> | undefined;
  providers: Observable<Provider[]> | undefined;
  periods: Observable<Period[]> | undefined;
  types: Observable<BillType[]> | undefined;

  constructor() {
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

  ngOnInit() {
    this.loadSelectOptions();
  }

  loadSelectOptions() {
    this.categories = this.categoryService.getAllCategories();
    this.providers = this.providerService.getAllProviders();
    this.periods = this.periodService.get();
    this.types = this.billService.getBillTypes();
  }

  onSubmit() {
    if (this.billForm.valid) {
      const formValue = this.billForm.value;
      formValue.date = `${formValue.date}T00:00:00Z`;

      const newBill: BillPostRequest = formValue;

      console.log(formValue)
      this.billService.addBill(newBill).subscribe({
        next: (response: any) => {
          console.log('Añadido correctamente', response);
          this.showModal('Éxito', 'El gasto se ha añadido correctamente.');
          this.resetForm();
        },
        error: (error: any) => {
          console.error('Error en el post', error);
          if (error.status === 409) {
            this.showModal('Error', 'Datos incorrectos/inexistentes. Por favor, intentelo de nuevo.');
          } else {
            this.showModal('Error', 'Ha ocurrido un error al añadir la categoría. Por favor, inténtelo de nuevo.');
          }
        }
      });
    } else {
      console.log('Formulario inválido');
      this.showModal('Error', 'Por favor, complete todos los campos requeridos correctamente.');
    }
  }

  resetForm() {
    this.billForm.reset();
    this.loadSelectOptions();
  }

  showModal(title: string, message: string) {
    const modalRef = this.modalService.open(NgModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
  }

  openNewCategoryModal() {
    this.modalService.open(this.newCategoryModal, { ariaLabelledBy: 'modal-basic-title' });
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
    // console.log('Nueva categoría:', this.newCategoryForm.value);
    //cerrar el modal y actualiza la lista de categorías
    this.modalService.dismissAll();
    this.newCategoryForm.reset();
  }

}
