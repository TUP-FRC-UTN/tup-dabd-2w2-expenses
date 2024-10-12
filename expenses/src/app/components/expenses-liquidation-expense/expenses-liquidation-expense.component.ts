import { Component, inject, OnInit } from '@angular/core';
import LiquidationExpense from '../../models/liquidationExpense';
import { LiquidationExpenseService } from '../../services/liquidation-expense.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PeriodSelectComponent } from '../selects/period-select/period-select.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-expenses-liquidation-expense',
  standalone: true,
  imports: [PeriodSelectComponent, CommonModule],
  templateUrl: './expenses-liquidation-expense.component.html',
  styleUrl: './expenses-liquidation-expense.component.css',
})
export class ExpensesLiquidationExpenseComponent implements OnInit {
  liquidationExpensesService: LiquidationExpenseService = inject(
    LiquidationExpenseService
  );
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  liquidationExpensesList: LiquidationExpense[] = [];
  id: number | null = null; // Variable to store the ID

  ngOnInit(): void {
    this.loadId();
    this.loadList(this.id);
  }
  private loadId(): void {
    // Retrieve the 'id' parameter from the route
    this.route.paramMap.subscribe((params) => {
      this.id = Number(params.get('id')); // Cast to number if necessary
      console.log('Retrieved ID:', this.id); // Debugging line
    });
    console.log(this.liquidationExpensesList);
  }
  private loadList(id: number | null) {
    if (id) {
      this.liquidationExpensesService
        .get(id)
        .subscribe((data: LiquidationExpense[]) => {
          this.liquidationExpensesList = data;
        });
    }
  }
  selectPeriodChange(id: any) {
    this.router.navigate([`/liquidation-expense/${id}`]).then(() => {
      this.loadList(id);
    })
  }

  closeLiquidation(id: number | null) {
    if (id) {
      console.log(id);
      this.liquidationExpensesService.putCloseLiquidation(id).subscribe({
        next: () => {
          console.log('Liquidación cerrada exitosamente');
          this.loadList(this.id);
        },
      });
    }
  }
  closeLiquidationPeriod(id: number | null) {
    console.log(id);

    if (id) {
      this.liquidationExpensesService
        .putCloseLiquidationExpensesPeriod(id)
        .subscribe({
          next: () => {
            this.loadList(this.id);
          },
        });
    }
  }
}
