import { Component, inject, input, Input, OnInit, SimpleChanges } from '@angular/core';
import { ExpenseServiceService} from "../../../../services/expense.service";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PeriodSelectComponent} from "../../../selects/period-select/period-select.component";
import {CommonModule, DatePipe} from '@angular/common';

import {Chart, registerables} from 'chart.js';
Chart.register(...registerables)


import {NgPipesModule} from "ngx-pipes";
import {
  TableColumn, TableComponent, ConfirmAlertComponent,

  MainContainerComponent,
  ToastService, TableFiltersComponent, Filter, FilterConfigBuilder, FilterOption, SelectFilter
} from "ngx-dabd-grupo01" ;
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import Expense from "../../../../models/expense";
import {ReportPeriodService} from "../../../../services/report-period/report-period.service";
import {Observable} from "rxjs";
import {ReportPeriod} from "../../../../models/report-period/report-period";

@Component({
  selector: 'app-expenses-report',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule, PeriodSelectComponent, TableComponent, NgPipesModule, MainContainerComponent, TableFiltersComponent
  ],
  providers: [DatePipe, NgbActiveModal],
  templateUrl: './expenses-report.component.html',
  styleUrl: './expenses-report.component.css'
})
export class ExpensesReportComponent {
  private reportPeriodService = inject(ReportPeriodService);
  reportPeriod: Observable<ReportPeriod> | undefined
  idsTosearch: number[] = []

  periods: FilterOption[] = [];
  lotss: FilterOption[] = []
  types: FilterOption[]= []
  filterConfig: Filter[] = [
    new SelectFilter('Lote','lot','Seleccione un lote',this.lotss),
    new SelectFilter('Tipo de lote','type','Seleccione un tipo de lote',this.types),
    new SelectFilter('Periodos','period','Seleccione un periodo',this.periods)
  ]
  expenses: Expense[] = [];
  searchTerm: string = "";



  constructor() {

  }
  


  loadReportPeriod(ids: number[]){
    this.reportPeriod = this.reportPeriodService.getReportPeriods(ids)
  }



  onFilterTextBoxChanged($event: Event) {

  }
  filterChange($event: Record<string, any>) {

  }





}
