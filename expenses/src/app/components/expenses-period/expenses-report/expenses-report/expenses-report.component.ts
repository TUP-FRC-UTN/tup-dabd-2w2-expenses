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
export class ExpensesReportComponent implements OnInit{
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



  loadReportPeriod(ids: number[]): Observable<ReportPeriod> {
    return this.reportPeriodService.getReportPeriods(ids);
  }


  ngOnInit(): void {
    this.loadReportPeriod([1, 2]).subscribe(
      (data) => {
        console.log(data); // Ver los datos del reporte
        this.createPieChart(data);
      },
      (error) => {
        console.error('Error al cargar el reporte', error);
      }
    );
  }




  onFilterTextBoxChanged($event: Event) {

  }
  filterChange($event: Record<string, any>) {

  }


  /**
   * idea para graficos:
   *
   *  T O R T A
   * - que muestre la distribucion porcentual
   * de los gastos ordinarios y extraordinarios.
   *
   *  B A R R A
   *  - que muestre los montos de cada periodo selecionado.
   */

  createPieChart(data: ReportPeriod){
    const ordinaryData = data.resume.ordinary.map(o =>({
      category: o.category,
      percentage: o.data.percentage
    }));
    const extraordinaryData = data.resume.extraordinary.map(e => ({
      category: e.category,
      percentage: e.data.percentage
    }));

    // Combine both arrays para un solo gráfico
    const allData = [...ordinaryData, ...extraordinaryData];
    const labels = allData.map(item => `${item.category} (${item.percentage.toFixed(2)}%)`);
    const percentages = allData.map(item => item.percentage);

    // Crear gráfico de torta
    new Chart('myPieChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Distribución porcentual de gastos',
          data: percentages,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
  }
}
