import { Component, inject, OnInit } from '@angular/core';
import { ExpensesPeriodNavComponent } from '../../navs/expenses-period-nav/expenses-period-nav.component';
import { ExpenseServiceService } from '../../../services/expense.service';
import Expense from '../../../models/expense';
import { ActivatedRoute } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { generateNumberArray } from '../../../utils/generateArrayNumber';

@Component({
  selector: 'app-expenses-period-expenses',
  standalone: true,
  imports: [ExpensesPeriodNavComponent, ExpensesPeriodNavComponent,NgbModule],
  templateUrl: './expenses-period-expenses.component.html',
  styleUrl: './expenses-period-expenses.component.css',
})
export class ExpensesPeriodExpensesComponent implements OnInit {

  cantPages: number = 1; 
  indexActive = 1;
  size = 10;
  currentPage: number = 1;
  visiblePages: number[] = [];


  ngOnInit(): void {
    this.loadId()
    this.loadList()
  }
  private expenseService: ExpenseServiceService = inject(ExpenseServiceService);
  private route = inject(ActivatedRoute);
  periodId: string | null = null;
  listExpenses: Expense[] = [];

  loadList() {
    this.expenseService.getExpenses(0,10,Number(this.periodId)).subscribe(data=>{
      this.listExpenses=data.content;
      this.cantPages=data.totalElements
      this.currentPage=data.number
    })
  }

  loadId() {
    this.periodId = this.route.snapshot.paramMap.get('period_id');
  }
changeIndex($event:number){
  this.currentPage=$event
}
}
