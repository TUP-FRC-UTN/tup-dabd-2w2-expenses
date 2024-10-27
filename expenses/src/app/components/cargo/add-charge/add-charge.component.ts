import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChargeService } from '../../../services/charge.service';
import { CategoryCharge, Charge } from '../../../models/charge';
import { PeriodSelectComponent } from '../../selects/period-select/period-select.component';
import Lot from '../../../models/lot';
import { PeriodService } from '../../../services/period.service';
import { LotsService } from '../../../services/lots.service';
import Period from '../../../models/period';
import { ExpensesChargesNavComponent } from '../../navs/expenses-charges-nav/expenses-charges-nav.component';
import { CommonModule } from '@angular/common';
import { ModalService } from 'ngx-dabd-2w1-core';
import { NgModalComponent } from '../../modals/ng-modal/ng-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-charge',
  standalone: true,
  imports: [ReactiveFormsModule, PeriodSelectComponent, ExpensesChargesNavComponent,CommonModule,NgModalComponent],
  templateUrl: './add-charge.component.html',
  styleUrl: './add-charge.component.css',
})
export class AddChargeComponent implements OnInit{
  // chargeForm: FormGroup;
  private fb: FormBuilder = inject(FormBuilder);
  private chargeService = inject(ChargeService);
  private modalService = inject(NgbModal);
  private router = inject(Router);
  lots : Lot[] = []

  private readonly periodService = inject(PeriodService)
  private readonly lotsService = inject(LotsService)
  listPeriodo:Period[] =[];
  categoriaCargos: CategoryCharge[] = [];

  selectedPeriodId: number | null = null;


  onCancel() {
    this.chargeForm.reset();
    this.router.navigate([`cargos`])
  }

  loadSelect() {
    this.periodService.get().subscribe((data=>{
      this.listPeriodo=data
    }))
    this.lotsService.get().subscribe((data: Lot[]) => {
      this.lots = data;
    })
    this.chargeService.getCategoryCharges().subscribe((data: CategoryCharge[]) => {
      this.categoriaCargos = data;
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
      console.log(charge);
      this.chargeService.createCharge(charge).subscribe(
        (response) => {
          
          const modalRef = this.modalService.open(NgModalComponent);
          modalRef.componentInstance.charge = charge;
          modalRef.componentInstance.message = "El cargo se ha registrado correctamente";

          modalRef.result.then(
            (result) => {
              if (result) {
                //this.loadCharges();
              }
            },
            () => {}
          );
          console.log('Cargo registrado exitosamente:', response);
          //('Cargo registrado exitosamente');
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
