import { Component, EventEmitter, inject, Input, Output, TemplateRef } from '@angular/core';

import { ModalDismissReasons, NgbActiveModal, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-expenses-modal',
  standalone: true,
  imports: [],
  templateUrl: './expenses-modal.component.html',
  styleUrl: './expenses-modal.component.css'
})
export class ExpensesModalComponent {
  @Input() title!: string;
  @Input() paragraph!: string;
  @Input() body!: string;
  @Output() onAccept: EventEmitter<void> = new EventEmitter<void>();
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();

	closeResult = '';


  accept() {
    this.onAccept.emit();
    this.onCancel.emit()
  }

  cancel() {
    this.onCancel.emit();
    
  }
}
