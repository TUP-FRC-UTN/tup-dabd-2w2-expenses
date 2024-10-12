import { Component, inject, OnInit } from '@angular/core';
import LiquidationExpense from '../../models/liquidationExpense';
import { LiquidationExpenseService } from '../../services/liquidation-expense.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PeriodSelectComponent } from '../selects/period-select/period-select.component';
@Component({
  selector: 'app-expenses-liquidation-expense',
  standalone: true,
  imports: [PeriodSelectComponent],
  templateUrl: './expenses-liquidation-expense.component.html',
  styleUrl: './expenses-liquidation-expense.component.css',
})
export class ExpensesLiquidationExpenseComponent implements OnInit {
  liquidationExpensesService: LiquidationExpenseService = inject(
    LiquidationExpenseService
  );
  route: ActivatedRoute = inject(ActivatedRoute); 
  router:Router=inject(Router)
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
    console.log(this.liquidationExpensesList)
  }
  private loadList(id:number|null) {
    if (id) {
      this.liquidationExpensesService
        .get(id)
        .subscribe((data: LiquidationExpense[]) => {
          this.liquidationExpensesList = data;
        });
    }

  }
  selectPeriodChange(id:any){
    this.router.navigate([`/liquidation-expense/${id}`])
    this.loadList(id)
  }
}
