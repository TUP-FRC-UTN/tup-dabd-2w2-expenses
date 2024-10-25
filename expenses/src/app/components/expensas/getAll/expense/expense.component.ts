import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { ExpenseServiceService } from '../../../../services/expense.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Expense from '../../../../models/expense';
import { FormsModule } from '@angular/forms';
import { PeriodSelectComponent } from '../../../selects/period-select/period-select.component';
import { forkJoin } from 'rxjs';
import Period from '../../../../models/period';
import { Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodService } from '../../../../services/period.service';
import { LotsService } from '../../../../services/lots.service';
import Lot from '../../../../models/lot';


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
  private readonly periodService = inject(PeriodService)
  private readonly lotsService = inject(LotsService)
  lots : Lot[] = []

  lotId : number = 1


  @Input() selectedOptionPeriod!: number;
  @Input() selectedOptionLot!: number;
  @Input() periodSelected! : number
  periodId : number = 1
  ngOnInit(): void {
    this.loadExpenses()
    this.loadSelect()
  }
  //Carga las expensas
  private loadExpenses() {
    console.log('Cargando expensas')
    this.service.get().subscribe((data: Expense[]) => {
     this.expenses = data;
     this.expenses.sort((a, b) =>( a.lotId ?? 0)  - (b.lotId ?? 0))
     console.log(this.expenses)
        });
  }
  periodChange(id: number){
    if(id == 0) {
      this.loadExpenses()
    } else {
      console.log('El id es ' +id)
      this.periodId = id
    }
   
  }
  //carga el select de periodo y lote
  loadSelect() {
    this.periodService.get()
    this.lotsService.get().subscribe((data: Lot[]) => {
      this.lots = data;
    })
  }
  //carga las expensas
  loadExpense(periodId:number, lotId:number) {
    if(this.lotId == 0) {
      this.loadExpenses()
      console.log('Cargando todas')
    } else {
      console.log('Cargando expensas por periodo, PeriodoId =' + this.periodId + "|LoteId = " + this.lotId)
      this.service.getByPeriodAndPlot(periodId,lotId).subscribe((data: Expense[]) => {
        this.expenses = data;
        console.log('Expensas' + this.expenses)
           });
    }
  }
  //Cambia el lote
  onOptionChange(newValue: number): void {
    this.lotId = newValue;
      console.log('lotId: '+this.lotId)
      this.loadExpense(this.periodId, this.lotId)
    
  }
  onPeriodChange(newValue: number) : void {
    this.periodId = newValue;
    console.log('periodId = '+ this.periodId)
    this.loadExpense(this.periodId, this.lotId)
  }
}
