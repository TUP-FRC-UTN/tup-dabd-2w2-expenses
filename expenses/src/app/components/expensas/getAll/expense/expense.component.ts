import { Component, inject, input, Input, OnInit, SimpleChanges } from '@angular/core';
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
import Category from '../../../../models/category';
import { CategoryService } from '../../../../services/category.service';
import { BillService } from '../../../../services/bill.service';
import BillType from '../../../../models/billType';


@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [ CommonModule ,RouterModule, FormsModule, PeriodSelectComponent],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent implements OnInit{
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute); 

  private readonly periodService = inject(PeriodService)
  private readonly lotsService = inject(LotsService)
  private readonly service = inject(ExpenseServiceService)
  private readonly billService = inject(BillService)

  selectedLotId: number = 0;
  selectedTypeId: number = 0;
  selectedPeriodId: number = 0;



  expenses: Expense[] = []
  lots : Lot[] = []
  tipos: BillType[] = []

  totalElements: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  periodId : number | null = null
  lotId : number | null = null
  typeId : number | null = null
  ngOnInit(): void {
    this.loadExpenses();
    this.loadSelect()
  }

  loadExpenses(page: number = 0, size: number = 10): void {
    this.service.getExpenses(page, size, this.selectedPeriodId, this.selectedLotId,this.selectedTypeId).subscribe(data => {
      this.expenses = data;
    });
  }

  onPageChange(page: number): void {
    this.loadExpenses(page, this.pageSize);
  }


  onPeriodChange(periodId: number) {
    this.selectedPeriodId = periodId;
    this.loadExpenses(periodId);
  }

  onOptionChange() {
    this.loadExpenses();
  }

  clearFilters() {
    this.selectedLotId = 0;
    this.selectedTypeId = 0;
    this.selectedPeriodId = 0;
    this.loadExpenses();
  }
  //carga el select de periodo y lote
  loadSelect() {
    this.periodService.get()
    this.lotsService.get().subscribe((data: Lot[]) => {
      this.lots = data;
    })
    this.billService.getBillTypes().subscribe((data: BillType[]) => {
      this.tipos = data
    })
  }
}
