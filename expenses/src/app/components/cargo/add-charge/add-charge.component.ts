import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChargeService } from '../../../services/charge.service';
import { Charge } from '../../../models/charge';
import { PeriodSelectComponent } from '../../selects/period-select/period-select.component';
import Lot from '../../../models/lot';
import { PeriodService } from '../../../services/period.service';
import { LotsService } from '../../../services/lots.service';
import Period from '../../../models/period';

@Component({
  selector: 'app-add-charge',
  standalone: true,
  imports: [ReactiveFormsModule, PeriodSelectComponent],
  templateUrl: './add-charge.component.html',
  styleUrl: './add-charge.component.css',
})
export class AddChargeComponent implements OnInit{
  // chargeForm: FormGroup;
  private fb: FormBuilder = inject(FormBuilder);
  private chargeService = inject(ChargeService);
  lots : Lot[] = []

  private readonly periodService = inject(PeriodService)
  private readonly lotsService = inject(LotsService)
   listPeriodo:Period[] =[]

  selectedPeriodId: number | null = null;

  onCancel() {
    this.chargeForm.reset();
  }

  loadSelect() {
    this.periodService.get().subscribe((data=>{
      this.listPeriodo=data
    }))
    this.lotsService.get().subscribe((data: Lot[]) => {
      this.lots = data;
    })
  }
  chargeForm: FormGroup;

  constructor() {
    this.chargeForm = this.fb.group({
      lotId: ['', Validators.required],
      date: ['', Validators.required],
      periodId: ['', Validators.required],
      amount: ['', Validators.required],
      categoryChargeId: ['', Validators.required],
      description:['']
    });
  }

  ngOnInit(): void {
    this.loadSelect();
  }

  onSubmit(): void {
    console.log(this.chargeForm.value)
    console.log(this.chargeForm.valid)

    if (this.chargeForm.valid) {
      const formValue = this.chargeForm.value;
      const charge: Charge = {
        ...formValue,
        date: new Date(formValue.date).toISOString(),
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
        this.chargeForm.markAllAsTouched(); 
    }
  }
}
