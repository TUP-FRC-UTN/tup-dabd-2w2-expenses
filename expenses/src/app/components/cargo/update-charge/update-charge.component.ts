import { ChargeService } from './../../../services/charge.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryCharge, Charge } from '../../../models/charge';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { PeriodService } from '../../../services/period.service';
import { LotsService } from '../../../services/lots.service';
import Lot from '../../../models/lot';

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
  private readonly periodService = inject(PeriodService);
  private readonly lotsService = inject(LotsService);
  isEditing: boolean = false;
  @Input() charge?: Charge;
  lots: Lot[] = [];
  selectedCharges: number[] = [];
  categoryCharges: CategoryCharge[] = [];

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
    this.loadSelect();
    this.loadCategoryCharge();  
  }

  loadData() {
    if (this.charge) {
      this.chargeForm.patchValue({
        fechaEmision: (moment(this.charge.date, 'YYYY-MM-DD').format('YYYY-MM-DD')),
        lote: this.charge.lotId,
        tipo: this.charge.categoryCharge.name,
        periodo: this.charge.period,
        monto: (this.charge.amount),
        description: this.charge.description,//Esto se podria cambiar por charge.description
      });
    }
  }

  getPlotNumber(lotId : number){
    const lot = this.lots.find(lot => lot.id === lotId);
    return lot ? lot.plot_number : undefined;
  }

  loadSelect() {
    this.periodService.get()
    this.lotsService.get().subscribe((data: Lot[]) => {
      this.lots = data;
    })
    this.lotsService.get().subscribe((data: Lot[]) => {
      this.lots = data;
    })
  }
  loadCategoryCharge(){
    this.chargeService.getCategoryCharges().subscribe((data: CategoryCharge[]) => {
      this.categoryCharges = data;
    })
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
