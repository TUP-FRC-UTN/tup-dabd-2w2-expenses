import { Component, inject, OnInit } from '@angular/core';
import { ExpensesPeriodNavComponent } from '../../navs/expenses-period-nav/expenses-period-nav.component';
import { ExpenseServiceService } from '../../../services/expense.service';
import Expense from '../../../models/expense';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expenses-period-expenses',
  standalone: true,
  imports: [ExpensesPeriodNavComponent],
  templateUrl: './expenses-period-expenses.component.html',
  styleUrl: './expenses-period-expenses.component.css',
})
export class ExpensesPeriodExpensesComponent implements OnInit {
  ngOnInit(): void {
    this.loadId()
    this.loadList()
  }
  private expenseService: ExpenseServiceService = inject(ExpenseServiceService);
  private route = inject(ActivatedRoute);
  periodId: string | null = null;
  listExpenses: Expense[] = [];

  loadList() {
    this.expenseService.getByPeriod(Number(this.periodId)).subscribe(data=>{
      console.log(data)
      this.listExpenses=data;
    })
  }
  loadId() {
    this.periodId = this.route.snapshot.paramMap.get('period_id');
  }
}
