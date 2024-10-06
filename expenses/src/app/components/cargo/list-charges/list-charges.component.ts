import { Component, inject, OnInit } from '@angular/core';
import { Charge } from '../../../models/charge';
import { ChargeService } from '../../../services/charge.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BorrarItemComponent } from '../../borrar-item/borrar-item.component';

@Component({
  selector: 'app-list-charges',
  standalone: true,
  imports: [],
  templateUrl: './list-charges.component.html',
  styleUrl: './list-charges.component.css',
})
export class ListChargesComponent implements OnInit {
  charges: Charge[] = [];
  private chargeService = inject(ChargeService);
  private modalService = inject(NgbModal);

  selectedCharges: number[] = [];

  ngOnInit(): void {
    this.chargeService.getCharges().subscribe((charges) => {
      this.charges = charges;
    });
  }

  toggleSelection(charge: Charge) {
    const index = this.selectedCharges.indexOf(charge.id);
    if (index > -1) {
      this.selectedCharges.splice(index, 1);
    } else {
      this.selectedCharges.push(charge.id);
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
      () => {
      }
    );
  }

  deleteCharge(chargeId: number) {
    this.chargeService.deleteCharge(chargeId).subscribe(() => {
      this.charges = this.charges.filter((charge) => charge.id !== chargeId);
    });
  }
}
