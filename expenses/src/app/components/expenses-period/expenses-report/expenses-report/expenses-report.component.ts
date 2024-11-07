import { Component, inject, input, Input, OnInit, SimpleChanges } from '@angular/core';
import { ExpenseServiceService } from "../../../../services/expense.service";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PeriodSelectComponent } from "../../../selects/period-select/period-select.component";
import { CommonModule, DatePipe } from '@angular/common';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';

import { NgPipesModule } from "ngx-pipes";
import {
  TableColumn, TableComponent, ConfirmAlertComponent,

  MainContainerComponent,
  ToastService, TableFiltersComponent, Filter, FilterConfigBuilder, FilterOption, SelectFilter
} from "ngx-dabd-grupo01";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import Expense from "../../../../models/expense";
import { BaseChartDirective } from 'ng2-charts';

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
export class ExpensesReportComponent {
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

  onFilterTextBoxChanged($event: Event) {

  }
  filterChange($event: Record<string, any>) {

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
  }
}
