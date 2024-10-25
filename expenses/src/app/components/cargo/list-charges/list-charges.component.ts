import { Component, inject, OnInit } from '@angular/core';
import { Charge } from '../../../models/charge';
import { ChargeService } from '../../../services/charge.service';
import { CategoryCharge } from '../../../models/charge';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateChargeComponent } from '../update-charge/update-charge.component';
import { CommonModule } from '@angular/common';
import { PeriodSelectComponent } from '../../selects/period-select/period-select.component';
import Lot from '../../../models/lot';
import { LotsService } from '../../../services/lots.service';
import { PeriodService } from '../../../services/period.service';
import { BorrarItemComponent } from '../../modals/borrar-item/borrar-item.component';
import { ExpensesChargesNavComponent } from '../../navs/expenses-charges-nav/expenses-charges-nav.component';
import { ExpensesBillsNavComponent } from '../../navs/expenses-bills-nav/expenses-bills-nav.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list-charges',
  standalone: true,
  imports: [UpdateChargeComponent, CommonModule, PeriodSelectComponent, ExpensesBillsNavComponent, ExpensesChargesNavComponent],
  templateUrl: './list-charges.component.html',
  styleUrl: './list-charges.component.css',
})

export class ListChargesComponent implements OnInit {
  charges: Charge[] = [];
  private chargeService = inject(ChargeService);
  private modalService = inject(NgbModal);

  selectedCharge: Charge | null = null;
  selectedCharges: number[] = [];
  categoryCharges: CategoryCharge[] = [];
  params : number[] = [];

  lots: Lot[] = [];

  private readonly periodService = inject(PeriodService);
  private readonly lotsService = inject(LotsService);

  //f//iltros : FormGroup;

  ngOnInit(): void {
    this.loadSelect();
    this.loadCategoryCharge();
    this.loadCharges();

   // this.filtros = new FormGroup({});
  }

  loadCharges(): void {
    
    if(this.lots.length !=0) {
      this.params.push();

    }
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
  loadCategoryCharge(){
    this.chargeService.getCategoryCharges().subscribe((data: CategoryCharge[]) => {
      this.categoryCharges = data;
    })
  }

  toggleSelection(charge: Charge) {
    const index = this.selectedCharges.indexOf(charge.chargeId);
    if (index > -1) {
      this.selectedCharges.splice(index, 1);
    } else {
      this.selectedCharges.push(charge.chargeId);
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
