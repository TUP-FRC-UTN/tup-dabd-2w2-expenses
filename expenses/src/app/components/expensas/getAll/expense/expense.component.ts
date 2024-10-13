import { Component, inject, OnInit } from '@angular/core';
import { ExpenseServiceService } from '../../../../services/expense.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Expense from '../../../../models/expense';
import { FormsModule } from '@angular/forms';
import { PeriodSelectComponent } from '../../../selects/period-select/period-select.component';
import { forkJoin } from 'rxjs';
import Period from '../../../../models/period';
import { Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [ CommonModule ,RouterModule, FormsModule, PeriodSelectComponent],
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
    console.log('Cargando expensas')
    this.service.get().subscribe((data: Expense[]) => {
     this.expenses = data;
     this.expenses.sort((a, b) => a.lotId - b.lotId)
     console.log(this.expenses)
        });
  }
  onPeriodSelected(periodId: number): void {
    console.log(periodId)
  }

}
