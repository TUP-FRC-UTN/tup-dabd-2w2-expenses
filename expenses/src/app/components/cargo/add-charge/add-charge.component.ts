import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChargeService } from '../../../services/charge.service';
import { Charge } from '../../../models/charge';
import { PeriodSelectComponent } from '../../selects/period-select/period-select.component';

@Component({
  selector: 'app-add-charge',
  standalone: true,
  imports: [ReactiveFormsModule, PeriodSelectComponent],
  templateUrl: './add-charge.component.html',
  styleUrl: './add-charge.component.css'
})
export class AddChargeComponent {
  // chargeForm: FormGroup;
  private fb: FormBuilder = inject(FormBuilder);
  private chargeService = inject(ChargeService);

  // constructor() {
  //   this.chargeForm = this.fb.group({
  //     fechaEmision: ['', Validators.required],
  //     lote: ['', Validators.required],
  //     tipo: ['', Validators.required],
  //     periodo: ['', Validators.required],
  //     monto: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
  //     descripcion: ['', Validators.required]
  //   });
  // }

  // onSubmit() {
  //   if (this.chargeForm.valid) {
  //     const newCharge: Charge = {
  //       id: Math.floor(Math.random() * 1000),
  //       ...this.chargeForm.value
  //     };

  //     this.chargeService.addCharge(newCharge).subscribe(response => {
  //       console.log('se agregó', response);
  //       this.chargeForm.reset();
  //     });
  //   } else {
  //     console.log('formulario invalido');
  //   }
  // }

  selectedPeriodId: number | null = null;

  onCancel() {
    this.chargeForm.reset();
  }


  chargeForm: FormGroup;

  constructor() {
    this.chargeForm = this.fb.group({
      fineId: ['', Validators.required],
      lotId: ['', Validators.required],
      date: ['', Validators.required],
      periodId: ['', Validators.required],
      amount: ['', Validators.required],
      categoryChargeId: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.chargeForm.valid) {
      const formValue = this.chargeForm.value;
      const charge: Charge = {
        ...formValue,
        date: new Date(formValue.date).toISOString()
      };

      this.chargeService.createCharge(charge).subscribe(
        (response) => {
          console.log('Cargo registrado exitosamente:', response);
          alert('Cargo registrado exitosamente');
          this.chargeForm.reset();
        },
        (error) => {
          console.error('Error al registrar el cargo:', error);
          alert('Hubo un error al registrar el cargo');
        }
      );
    } else {
      alert('Por favor, complete todos los campos requeridos.');
    }
  }
}
