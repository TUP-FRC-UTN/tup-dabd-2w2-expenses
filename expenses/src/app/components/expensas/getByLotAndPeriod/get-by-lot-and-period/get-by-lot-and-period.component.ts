import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PeriodSelectComponent } from '../../../selects/period-select/period-select.component';
import { ExpenseServiceService } from '../../../../services/expense.service';
import Expense from '../../../../models/expense';
import { PeriodService } from '../../../../services/period.service';
import { LotsService } from '../../../../services/lots.service';
import Lot from '../../../../models/lot';
import { ExpensesPeriodNavComponent } from '../../../navs/expenses-period-nav/expenses-period-nav.component';

@Component({
  selector: 'app-get-by-lot-and-period',
  standalone: true,
  imports: [CommonModule ,RouterModule, FormsModule, PeriodSelectComponent,ExpensesPeriodNavComponent],
  templateUrl: './get-by-lot-and-period.component.html',
  styleUrl: './get-by-lot-and-period.component.css'
})
export class GetByLotAndPeriodComponent implements OnInit {
  private readonly service = inject(ExpenseServiceService)
  private readonly periodService = inject(PeriodService)
  private readonly lotsService = inject(LotsService)
  expenses : Expense[] = []
  lots : Lot[] = []
  periodId : number = 1
  lotId : number = 1

  @Input() selectedOptionPeriod!: number;
  @Input() selectedOptionLot!: number;

  ngOnInit(): void {
    this.loadSelect()
    this.loadExpense(this.periodId,this.lotId)
  }
  loadExpense(periodId:number, lotId:number) {
    this.service.getByPeriodAndPlot(periodId,lotId).subscribe((data: Expense[]) => {
      this.expenses = data;
      console.log('Expensas' + this.expenses)
         });
  }
  loadSelect() {
    this.periodService.get()
    this.lotsService.get().subscribe((data: Lot[]) => {
      this.lots = data;
    })
  }

  
  onOptionChange(newValue: number): void {
    this.lotId = newValue;
   
    console.log('lotId: '+this.lotId)
    this.loadExpense(this.periodId, this.lotId)
  }
}
