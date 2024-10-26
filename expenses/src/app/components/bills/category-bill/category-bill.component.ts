import { Component } from '@angular/core';
import Category from "../../../models/category";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ExpensesBillsNavComponent} from "../../navs/expenses-bills-nav/expenses-bills-nav.component";
import {NgPipesModule} from "ngx-pipes";
import {CategoryService} from "../../../services/category.service";

@Component({
  selector: 'app-category-bill',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ExpensesBillsNavComponent,
    NgPipesModule
  ],
  templateUrl: './category-bill.component.html',
  styleUrl: './category-bill.component.css'
})
export class CategoryBillComponent {
  categoryForm: FormGroup;
  categories: Category[] = [];
  searchTerm = '';
  isEditing = false;
  currentCategoryId?: number;
  isLoading = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAllCategories()
      .subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: (error) => {
          console.error('Error al cargar categorías:', error);
          // Aquí podrías agregar un manejo de errores más sofisticado
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.isSubmitting = true;

      const categoryData = {
        name: this.categoryForm.value.name,
        description: this.categoryForm.value.description,
        is_delete: false
      };

      if (this.isEditing && this.currentCategoryId) {
        this.categoryService.updateCategory(this.currentCategoryId, categoryData)
          .subscribe({
            next: (updatedCategory) => {
              // Actualizar la categoría en el array local
              const index = this.categories.findIndex(
                cat => cat.category_id === this.currentCategoryId
              );
              if (index !== -1) {
                this.categories[index] = updatedCategory;
              }
              this.resetForm();
              this.loadCategories();
            },
            error: (error) => {
              console.error('Error al actualizar la categoría:', error);
              // Aquí podrías agregar un manejo de errores más sofisticado
            },
            complete: () => {
              this.isSubmitting = false;
            }
          });
      } else {
        this.categoryService.addCategory(categoryData as Category)
          .subscribe({
            next: (newCategory) => {
              this.categories.push(newCategory);
              this.resetForm();
            },
            error: (error) => {
              console.error('Error al agregar categoría:', error);
            },
            complete: () => {
              this.isSubmitting = false;
            }
          });
      }
    }
  }

  editCategory(category: Category): void {
    this.isEditing = true;
    this.currentCategoryId = category.category_id;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description
    });
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentCategoryId = undefined;
    this.categoryForm.reset();
  }

}
