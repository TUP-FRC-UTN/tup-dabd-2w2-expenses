import { Component, inject, OnInit } from '@angular/core';
import { ExpensesExpensesNavComponent } from '../../navs/expenses-expenses-nav/expenses-expenses-nav.component';
import { ExpensesPeriodNavComponent } from '../../navs/expenses-period-nav/expenses-period-nav.component';
import { PeriodService } from '../../../services/period.service';
import Period from '../../../models/period';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-expenses-period-list',
  standalone: true,
  imports: [ ExpensesPeriodNavComponent, NgClass],
  templateUrl: './expenses-period-list.component.html',
  styleUrl: './expenses-period-list.component.css',
})
export class ExpensesPeriodListComponent implements OnInit {
  private readonly periodService: PeriodService = inject(PeriodService);
  listOpenPeriod: Period[] = [];
  listPeriod: Period[] = [];
  cantPages: number[] = [];
  indexActive = 0;
  size = 10;

  ngOnInit(): void {
    this.loadPeriod();
    this.loadPaged(0);
  }

  loadPeriod() {
    this.periodService.getOpens().subscribe((data) => {
      this.listOpenPeriod = data;
    });
  }

  loadPaged(page: number) {
    this.periodService.getPage(this.size, page).subscribe((data) => {
      this.listPeriod = data;
    });

    this.getPages(this.size)
  }

  getPages(size: number) {
    this.periodService.get().subscribe(data => {

      let len = data.length / size

      len = Math.ceil(len)

      this.cantPages = Array(len).fill(0).map((x, i) => i);
    })
  }

  changeIndex(cant: number) {
    this.indexActive = cant;
    this.loadPaged(cant)
  }


}
