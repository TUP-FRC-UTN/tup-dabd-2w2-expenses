import {Component, Input} from '@angular/core';
import Category from "../../../../models/category";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CategoryService} from "../../../../services/category.service";

@Component({
  selector: 'app-delete-category-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-category-modal.component.html',
  styleUrl: './delete-category-modal.component.css'
})
export class DeleteCategoryModalComponent {
  @Input() category!: Category;

  constructor(
    public activeModal: NgbActiveModal,
    private categoryService: CategoryService
  ) {}

  confirmDelete() {
    const updatedCategory: Partial<Category> = {
      ...this.category,
      is_delete: true
    };

    this.categoryService.updateCategory(this.category.category_id!, updatedCategory)
      .subscribe({
        next: (response) => {
          this.activeModal.close({
            success: true,
            message: 'La categoría ha sido eliminada correctamente.',
            data: response
          });
        },
        error: (error) => {
          console.error('Error al eliminar la categoría:', error);
          this.activeModal.close({
            success: false,
            message: 'Ha ocurrido un error al eliminar la categoría. Por favor, inténtelo de nuevo.',
            error: error
          });
        }
      });
  }
}
