import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChargeService } from '../../../services/charge.service';
import { Charge } from '../../../models/charge';

@Component({
  selector: 'app-add-charge',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-charge.component.html',
  styleUrl: './add-charge.component.css'
})
export class AddChargeComponent {
  chargeForm: FormGroup;
  private fb: FormBuilder = inject(FormBuilder);
  private chargeService = inject(ChargeService);

  constructor() {
    this.chargeForm = this.fb.group({
      fechaEmision: ['', Validators.required],
      lote: ['', Validators.required],
      tipo: ['', Validators.required],
      periodo: ['', Validators.required],
      monto: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      descripcion: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.chargeForm.valid) {
      const newCharge: Charge = {
        id: Math.floor(Math.random() * 1000),
        ...this.chargeForm.value
      };

      this.chargeService.addCharge(newCharge).subscribe(response => {
        console.log('se agregó', response);
        this.chargeForm.reset();
      });
    } else {
      console.log('formulario invalido');
    }
  }

  onCancel() {
    this.chargeForm.reset();
  }
}
