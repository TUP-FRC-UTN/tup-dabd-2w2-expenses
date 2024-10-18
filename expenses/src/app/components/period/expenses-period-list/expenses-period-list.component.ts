import { Component, inject, OnInit } from '@angular/core';
import { ExpensesExpensesNavComponent } from '../../navs/expenses-expenses-nav/expenses-expenses-nav.component';
import { ExpensesPeriodNavComponent } from '../../navs/expenses-period-nav/expenses-period-nav.component';
import { PeriodService } from '../../../services/period.service';
import Period from '../../../models/period';

@Component({
  selector: 'app-expenses-period-list',
  standalone: true,
  imports: [ ExpensesPeriodNavComponent],
  templateUrl: './expenses-period-list.component.html',
  styleUrl: './expenses-period-list.component.css',
})
export class ExpensesPeriodListComponent implements OnInit {
  private readonly periodService: PeriodService = inject(PeriodService);
  listPeriod: Period[] = [];

  ngOnInit(): void {
    this.loadPeriod();
  }

  loadPeriod() {
    this.periodService.getOpens().subscribe((data) => {
      this.listPeriod = data;
    });
  }
}
