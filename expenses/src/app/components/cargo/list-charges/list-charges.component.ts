import { Component, inject, OnInit } from '@angular/core';
import { Charge } from '../../../models/charge';
import { ChargeService } from '../../../services/charge.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BorrarItemComponent } from '../../borrar-item/borrar-item.component';
import { UpdateChargeComponent } from '../update-charge/update-charge.component';
import { CommonModule } from '@angular/common';
import { PeriodSelectComponent } from '../../selects/period-select/period-select.component';
import Lot from '../../../models/lot';
import { LotsService } from '../../../services/lots.service';
import { PeriodService } from '../../../services/period.service';

@Component({
  selector: 'app-list-charges',
  standalone: true,
  imports: [UpdateChargeComponent, CommonModule, PeriodSelectComponent],
  templateUrl: './list-charges.component.html',
  styleUrl: './list-charges.component.css',
})
export class ListChargesComponent implements OnInit {
  charges: Charge[] = [];
  private chargeService = inject(ChargeService);
  private modalService = inject(NgbModal);

  selectedCharge: Charge | null = null;
  selectedCharges: number[] = [];

  lots: Lot[] = [];

  private readonly periodService = inject(PeriodService);
  private readonly lotsService = inject(LotsService);

  ngOnInit(): void {
    this.loadCharges();
    this.loadSelect();
  }

  loadCharges(): void {
    this.chargeService.getCharges().subscribe((charges) => {
      this.charges = charges;
      console.log(charges);
    });
  }

  loadSelect() {
    this.periodService.get()
    this.lotsService.get().subscribe((data: Lot[]) => {
      this.lots = data;
    })
  }

  toggleSelection(charge: Charge) {
    const index = this.selectedCharges.indexOf(charge.fineId);
    if (index > -1) {
      this.selectedCharges.splice(index, 1);
    } else {
      this.selectedCharges.push(charge.fineId);
    }
  }

  openDeleteModal(chargeId: number) {
    const modalRef = this.modalService.open(BorrarItemComponent);
    modalRef.componentInstance.chargeId = chargeId;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.deleteCharge(result);
        }
      },
      () => {}
    );
  }

  deleteCharge(chargeId: number) {
    this.chargeService.deleteCharge(chargeId).subscribe(() => {
      this.charges = this.charges.filter(
        (charge) => charge.fineId !== chargeId
      );
    });
  }

  openUpdateModal(charge: Charge) {
    const modalRef = this.modalService.open(UpdateChargeComponent);
    modalRef.componentInstance.charge = charge;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.loadCharges();
        }
      },
      () => {}
    );
  }
}
