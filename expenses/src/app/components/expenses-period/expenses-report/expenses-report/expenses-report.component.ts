import {Component, inject} from '@angular/core';
import {ExpenseServiceService} from "../../../../services/expense.service";
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {PeriodSelectComponent} from "../../../selects/period-select/period-select.component";
import {CommonModule, DatePipe} from '@angular/common';
import {NgPipesModule} from "ngx-pipes";
import {MainContainerComponent, TableComponent, TableFiltersComponent} from "ngx-dabd-grupo01";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  BarController,
  BubbleController,
  ChartData,
  ChartType,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController
} from 'chart.js';
import {BaseChartDirective} from "ng2-charts";
import Chart from 'chart.js/auto';
import {InfoExpensesListComponent} from "../../../modals/info-expenses-list/info-expenses-list.component";
import {InfoExpenseReportComponent} from "../../../modals/info-expense-report/info-expense-report.component";

Chart.register(BarController, PieController, RadarController, LineController, PolarAreaController, DoughnutController, BubbleController, ScatterController);
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

  modalService = inject(NgbModal);

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Expensas Totales por Lote' }
    ]
  };
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Expensas Totales por Lote' }
    ]
  };


  service : ExpenseServiceService = inject(ExpenseServiceService);

  ngOnInit(): void {
    this.loadExpenseData();
  }

  loadExpenseData(): void {
    this.service.getExpensesByLot().subscribe(expenses => {
      console.log(expenses);
      const lotNumbers = expenses.map(expense => expense.plotNumber);
      const totalAmounts = expenses.map(expense => expense.totalAmount);

      // Reasignar el objeto completo para forzar la detección de cambios
      this.barChartData = {
        labels: lotNumbers,
        datasets: [
          { data: totalAmounts, label: 'Distribución de Expensas por Lote' }
        ]
      }
    });
    this.service.getLotPercentage().subscribe(p => {
      console.log(p);
     const por = p.map(pe => {
        pe = pe * 100 ;
        return pe
      })
      this.pieChartData = {
       labels: this.barChartData.labels,
        datasets: [
          {data: por , label: "Contribución de Expensas por Lote (%)" },
        ]
      }
    })
  }


  /**
   * boton info
   */
  showInfo() {
    this.modalService.open(InfoExpenseReportComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      centered: true,
      scrollable: true
    });
  }



}
