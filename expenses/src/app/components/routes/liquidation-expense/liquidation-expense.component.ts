import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PeriodSelectComponent } from '../../selects/period-select/period-select.component';
import { LiquidationExpenseService } from '../../../services/liquidation-expense.service';
import LiquidationExpense from '../../../models/liquidationExpense';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-liquidation-expense',
  standalone: true,
  imports: [RouterModule, PeriodSelectComponent],
  templateUrl: './liquidation-expense.component.html',
  styleUrl: './liquidation-expense.component.css',
})
export class LiquidationExpenseComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly service = inject(LiquidationExpenseService)
  private readonly route = inject(ActivatedRoute); 
  liquidationExpense : LiquidationExpense[] = []


  ngOnInit(): void {
    this.loadLiquidationExpense()
  }
  
  private loadLiquidationExpense() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && !isNaN(Number(id))) {
        this.service.get(Number(id)).subscribe((data: LiquidationExpense[]) => {
          this.liquidationExpense = data;
  
          const requests = this.liquidationExpense.map(liq => 
            this.service.getById(Number(liq.expense_id))
          );
  
          forkJoin(requests).subscribe((results: LiquidationExpense[]) => {
            this.liquidationExpense = results;
            console.log(this.liquidationExpense);
          });
        });
      }
    });
  }

  onPeriodSelected(periodId: number): void {
    console.log(periodId)
    this.router.navigate([`expense/${periodId}`]);
  }

}
