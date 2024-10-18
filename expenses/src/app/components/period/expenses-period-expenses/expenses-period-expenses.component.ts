import { Component } from '@angular/core';
import { ExpensesPeriodNavComponent } from '../../navs/expenses-period-nav/expenses-period-nav.component';

@Component({
  selector: 'app-expenses-period-expenses',
  standalone: true,
  imports: [ExpensesPeriodNavComponent],
  templateUrl: './expenses-period-expenses.component.html',
  styleUrl: './expenses-period-expenses.component.css'
})
export class ExpensesPeriodExpensesComponent {

}
