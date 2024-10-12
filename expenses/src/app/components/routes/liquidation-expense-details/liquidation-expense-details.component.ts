import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LiquidationExpenseDetailsService } from '../../../services/liquidation-expense-details.service';
import { DatePipe, Location } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
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
  private readonly service = inject(LiquidationExpenseDetailsService);
  private readonly route = inject(ActivatedRoute);
  liquidationExpense: LiquidationExpense = new LiquidationExpense();

  ngOnInit(): void {
    this.loadLiquidationExpenseDetails();
  }

  private loadLiquidationExpenseDetails() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && !isNaN(Number(id))) {
        this.service.get(Number(id)).subscribe((data: LiquidationExpense) => {
          this.liquidationExpense = data;
        });
      }
    });
  }

  goBack() {
    this.location.back();
  }

  paid(value: string){
    alert(value);
  }
}
