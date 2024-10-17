import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalLiquidationDetailComponent } from './modal-liquidation-detail/modal-liquidation-detail.component';
import { LiquidationExpenseService } from '../../../services/liquidation-expense.service';
import LiquidationExpense from '../../../models/liquidationExpense';

@Component({
  selector: 'app-liquidation-expense-details',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './liquidation-expense-details.component.html',
  styleUrl: './liquidation-expense-details.component.css'
})
export class LiquidationExpenseDetailsComponent implements OnInit{

  private readonly location = inject(Location);
  private readonly service = inject(LiquidationExpenseService);
  private readonly route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  liquidationExpense: LiquidationExpense = new LiquidationExpense();

  ngOnInit(): void {
    this.loadLiquidationExpenseDetails();
  }

  private loadLiquidationExpenseDetails() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && !isNaN(Number(id))) {
        this.service.getById(Number(id)).subscribe((data: LiquidationExpense) => {
          this.liquidationExpense = data;
        });
      }
    });
  }

  goBack() {
    this.location.back();
  }


  openModal() {
    const modalRef = this.modalService.open(ModalLiquidationDetailComponent);
  }
}
