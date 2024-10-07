import { Component, inject, OnInit } from '@angular/core';
import { ExpenseServiceService } from '../../../../services/expense.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Expense from '../../../../models/expense';
import { FormsModule } from '@angular/forms';
import { PeriodSelectComponent } from '../../../selects/period-select/period-select.component';


@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [ RouterModule, FormsModule, PeriodSelectComponent],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent implements OnInit{
  private readonly router = inject(Router);
  private readonly service = inject(ExpenseServiceService)
  private readonly route = inject(ActivatedRoute); 
  expenses: Expense[] = []

  ngOnInit(): void {
    this.loadExpenses()
  }
  
  private loadExpenses() {
    this.route.paramMap.subscribe(params => {

    })
    
  }
  onPeriodSelected(periodId: number): void {
    console.log(periodId)
    this.router.navigate([`expense/${periodId}`]);
  }

}
