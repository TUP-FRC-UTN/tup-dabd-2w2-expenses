import { ChargeService } from './../../../services/charge.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Charge } from '../../../models/charge';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-update-charge',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-charge.component.html',
  styleUrl: './update-charge.component.css',
})
export class UpdateChargeComponent implements OnInit {
  chargeForm: FormGroup;
  private chargeService = inject(ChargeService);
  public activeModal = inject(NgbActiveModal);
  isEditing: boolean = false;
  @Input() charge?: Charge;

  constructor(private fb: FormBuilder) {
    this.chargeForm = this.fb.group({
      fechaEmision: [{ value: '', disabled: true }, Validators.required],
      lote: [{ value: '', disabled: true }, Validators.required],
      tipo: [{ value: '', disabled: true }, Validators.required],
      periodo: [{ value: '', disabled: true }, Validators.required],
      monto: [{ value: '', disabled: true }, Validators.required],
      descripcion: [{ value: '', disabled: true }],
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    if (this.charge) {
      this.chargeForm.patchValue({
        fechaEmision: this.charge.date.toISOString().split('T')[0],
        lote: this.charge.lotId,
        tipo: this.charge.categoryCharge.name,
        periodo: this.charge.period,
        monto: this.charge.amount,
        descripcion: this.charge.categoryCharge.description,
      });
    }
  }

  enableEdit() {
    this.isEditing = true;
    this.chargeForm.enable();
  }

  saveChanges() {
    if (this.chargeForm.valid) {
      const updatedCharge: Charge = {
        ...this.charge,
        ...this.chargeForm.value,
      };
      this.chargeService.updateCharge(updatedCharge).subscribe(
        (response) => {
          console.log('Cargo actualizado con éxito:', response);
          this.activeModal.close(true);
        },
        (error) => {
          console.error('Error al actualizar el cargo:', error);
        }
      );
    }
  }

  cancelEdit() {
    if (this.isEditing) {
      this.loadData();
      this.isEditing = false;
      this.chargeForm.disable();
    } else {
      this.activeModal.dismiss();
    }
  }
}
