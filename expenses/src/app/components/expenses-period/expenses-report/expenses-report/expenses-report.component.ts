import { Component, inject, input, Input, OnInit, SimpleChanges } from '@angular/core';
import { ExpenseServiceService } from "../../../../services/expense.service";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PeriodSelectComponent } from "../../../selects/period-select/period-select.component";
import { CommonModule, DatePipe } from '@angular/common';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';

import { NgPipesModule } from "ngx-pipes";
import {Chart, registerables} from 'chart.js';
Chart.register(...registerables)
import {
  TableColumn, TableComponent, ConfirmAlertComponent,

  MainContainerComponent,
  ToastService, TableFiltersComponent, Filter, FilterConfigBuilder, FilterOption, SelectFilter
} from "ngx-dabd-grupo01";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import Expense from "../../../../models/expense";
import { BaseChartDirective } from 'ng2-charts';
import {ReportPeriodService} from "../../../../services/report-period/report-period.service";
import {forkJoin, Observable} from "rxjs";
import {ReportPeriod} from "../../../../models/report-period/report-period";
import Period from "../../../../models/period";
import {PeriodService} from "../../../../services/period.service";

@Component({
  selector: 'app-expenses-report',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule, PeriodSelectComponent, TableComponent, NgPipesModule, MainContainerComponent, TableFiltersComponent, BaseChartDirective
  ],
  providers: [DatePipe, NgbActiveModal],
  templateUrl: './expenses-report.component.html',
  styleUrl: './expenses-report.component.css'
})
export class ExpensesReportComponent implements OnInit{
  private reportPeriodService = inject(ReportPeriodService);
  private periodService = inject(PeriodService);
  reportPeriod: Observable<ReportPeriod> | undefined
  idsTosearch: number[]= []

  periodos: Period[] = []
  periodosFilters : FilterOption[]= [];
  periods: FilterOption[] = [];




  filters: Filter[] = [];
  filterConfigPeriodReport: Filter[] = [];



  ordinaryData: { category: string, percentage: number }[] = [];
  extraordinaryData: { category: string, percentage: number }[] = [];

  periods: FilterOption[] = [];
  lotss: FilterOption[] = []
  types: FilterOption[] = []
  filterConfig: Filter[] = [
    new SelectFilter('Lote', 'lot', 'Seleccione un lote', this.lotss),
    new SelectFilter('Tipo de lote', 'type', 'Seleccione un tipo de lote', this.types),
    new SelectFilter('Periodos', 'period', 'Seleccione un periodo', this.periods)
  ]
  expenses: Expense[] = [];
  searchTerm: string = "";



  constructor() {}

  createFilter() {
    this.filterConfigPeriodReport = new FilterConfigBuilder()
      .checkboxFilter('Periodo', 'period', this.periodos.map(periodo => ({
        value: periodo.id.toString(),
        label: `${periodo.month}/${periodo.year}`
      })))
      .build();
  }



  loadReportPeriod(ids: number[]): Observable<ReportPeriod> {
    return this.reportPeriodService.getReportPeriods(ids);
  }

  loadSelect() {
    forkJoin({
      periodos: this.periodService.get()
    }).subscribe({
      next: ({ periodos }) => {
        this.periodos = periodos;
        this.periodosFilters = periodos.map(periodo => ({
          value: periodo.id.toString(),
          label: `${periodo.month}/${periodo.year}`
        }));
      }
    });
  }

  /**
   * esto está "mockeado" para devolver los del periodo de id 1
   */
  ngOnInit(): void {
    this.loadSelect();
    //aqui
    this.loadReportPeriod([1]).subscribe(
      (data) => {
        this.createFilter();
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
    // Aquí puedes obtener los IDs seleccionados
    this.idsTosearch = $event['period'] || []; // 'period' es el nombre del filtro que hemos usado en el checkbox
    console.log(this.idsTosearch);

  }



  //expenses: Expense[] = [];
  totalAmount = 0;
  averageAmount = 0;

  barChartData: ChartData = {
    labels: [],
    datasets: [{
      label: 'Monto Total',
      data: [],
      backgroundColor: '#0d6efd'
    }]
  };

  pieChartData: ChartData = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#dc3545']
    }]
  };
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
    }));}

  updateCharts() {
    // Procesar datos para gráfico de barras (por tipo de lote)
    const lotTotals = this.expenses.reduce((acc, expense) => {
      acc[expense.typePlot] = (acc[expense.typePlot] || 0) + expense.totalAmount;
      return acc;
    }, {} as Record<string, number>);

    this.barChartData.labels = Object.keys(lotTotals);
    this.barChartData.datasets[0].data = Object.values(lotTotals);

    // Procesar datos para gráfico de torta (por tipo de expensa)
    const expenseTypes = this.expenses.reduce((acc, expense) => {
      acc[expense.billType] = (acc[expense.billType] || 0) + expense.totalAmount;
      return acc;
    }, {} as Record<string, number>);

    this.pieChartData.labels = Object.keys(expenseTypes);
    this.pieChartData.datasets[0].data = Object.values(expenseTypes);
  }

  calculateSummary() {
    this.totalAmount = this.expenses.reduce((sum, expense) =>
      sum + expense.totalAmount, 0
    );
    this.averageAmount = this.totalAmount / this.expenses.length;
    // Combine both arrays para un solo gráfico
    const allData = [...this.ordinaryData, ...this.extraordinaryData];
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
