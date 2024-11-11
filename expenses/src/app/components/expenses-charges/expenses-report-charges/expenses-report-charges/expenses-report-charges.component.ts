import {Component, inject} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';
import {NgPipesModule} from "ngx-pipes";
import {MainContainerComponent, TableComponent, TableFiltersComponent} from "ngx-dabd-grupo01";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
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
import { ChargeService } from '../../../../../services/charge.service';

@Component({
  selector: 'app-expenses-report-charges',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule, TableComponent, NgPipesModule, MainContainerComponent, TableFiltersComponent, BaseChartDirective
  ],
  templateUrl: './expenses-report-charges.component.html',
  styleUrl: './expenses-report-charges.component.css'
})
export class ExpensesReportChargesComponent {
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Cargos Totales por Lote' }
    ]
  };
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Cargos Totales por Lote' }
    ]
  };

  selectPeriod : number = 0;
  service : ChargeService  = inject(ChargeService);

  ngOnInit(): void {
    this.loadChargesData();
  }

  loadChargesData(): void {
    const periodId = this.selectPeriod;
    this.service.getReport(periodId).subscribe(report =>{

    })
    /*this.service.getExpensesByLot().subscribe(expenses => {
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
    })*/
  }

}
