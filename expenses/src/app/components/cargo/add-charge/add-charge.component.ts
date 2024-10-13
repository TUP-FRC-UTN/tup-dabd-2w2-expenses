import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChargeService } from '../../../services/charge.service';
import { Charge } from '../../../models/charge';
import { PeriodSelectComponent } from '../../selects/period-select/period-select.component';
import { ExpenseChargeTypeSelectComponent } from '../../selects/expense-charge-type-select/expense-charge-type-select.component';
import { PeriodService } from '../../../services/period.service';
import Period from '../../../models/period';

@Component({
  selector: 'app-add-charge',
  standalone: true,
  imports: [ReactiveFormsModule, PeriodSelectComponent,ExpenseChargeTypeSelectComponent],
  templateUrl: './add-charge.component.html',
  styleUrl: './add-charge.component.css'
})
export class AddChargeComponent {
  // chargeForm: FormGroup;
  private fb: FormBuilder = inject(FormBuilder);
  private chargeService = inject(ChargeService);
  private periodosService = inject(PeriodService)
  periodList:Period[]=[]
  selectedPeriodId: number | null = null;

  onCancel() {
    this.chargeForm.reset();
  }


  chargeForm: FormGroup;

  constructor() {
    this.chargeForm = this.fb.group({
      lotId: ['', Validators.required],
      date: ['', Validators.required],
      periodId: [0, Validators.required],
      amount: ['', Validators.required],
      categoryChargeId: [0, Validators.required]
    });

  }

  ngOnInit(): void {
    this.periodosService.get().subscribe((data: Period[]) => {
      this.periodList = data;
    });
  }

  onSubmit(): void {
    console.log(this.chargeForm.value)
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
