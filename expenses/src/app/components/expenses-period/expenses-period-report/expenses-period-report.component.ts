import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ExpenseServiceService } from '../../../services/expense.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PeriodSelectComponent } from '../../selects/period-select/period-select.component';
import { CommonModule, DatePipe } from '@angular/common';
import {
  ChartConfiguration,
  ChartData,
  ChartEvent,
  ChartOptions,
  ChartType,
  Title,
} from 'chart.js';

import { NgPipesModule } from 'ngx-pipes';
import { Chart, registerables } from 'chart.js';
import {
  TableColumn,
  TableComponent,
  ConfirmAlertComponent,
  MainContainerComponent,
  ToastService,
  TableFiltersComponent,
  Filter,
  FilterConfigBuilder,
  FilterOption,
  SelectFilter,
} from 'ngx-dabd-grupo01';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Expense from '../../../models/expense';
import { BaseChartDirective } from 'ng2-charts';
import { ReportPeriodService } from '../../../services/report-period/report-period.service';
import { forkJoin, Observable } from 'rxjs';
import { ReportPeriod } from '../../../models/report-period/report-period';
import Period from '../../../models/period';
import { PeriodService } from '../../../services/period.service';
import { CategoryData } from '../../../models/report-period/category-data';
import { Periods } from '../../../models/charge';
import { Resume } from '../../../models/report-period/resume';
@Component({
  selector: 'app-expenses-report',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PeriodSelectComponent,
    TableComponent,
    NgPipesModule,
    MainContainerComponent,
    TableFiltersComponent,
    BaseChartDirective,
  ],
  providers: [DatePipe, NgbActiveModal],
  templateUrl: './expenses-period-report.component.html',
  styleUrl: './expenses-period-report.component.css',
})
export class ExpensesPeriodReportComponent implements OnInit {
  private reportPeriodService = inject(ReportPeriodService);
  private periodService = inject(PeriodService);

  reportPeriod: ReportPeriod | undefined;
  idsTosearch: number[] = [];
  periodos: Period[] = [];
  periodosFilters: FilterOption[] = [];
  periods: FilterOption[] = [];

  filters: Filter[] = [];
  filterConfigPeriodReport: Filter[] = [];

  ordinaryData: { category: string; percentage: number }[] = [];
  extraordinaryData: { category: string; percentage: number }[] = [];

  periodsFilter: FilterOption[] = [];
  lotss: FilterOption[] = [];
  types: FilterOption[] = [];

  filterConfig: Filter[] = [
    new SelectFilter('Lote', 'lot', 'Seleccione un lote', this.lotss),
    new SelectFilter(
      'Tipo de lote',
      'type',
      'Seleccione un tipo de lote',
      this.types
    ),
    new SelectFilter(
      'Periodos',
      'period',
      'Seleccione un periodo',
      this.periods
    ),
  ];

  expenses: Expense[] = [];
  searchTerm: string = '';

  chartInstances: any[] = [];
  resumeReportOrdinary: any;
  resumeReportExtraordinary: any;

  typeFilter: string = 'Monto';

  type(type: string) {
    this.typeFilter = type;
    this.loadResume();
  }

  constructor() {
    Chart.register(...registerables); // Registra todos los elementos de chart.js
  }

  ngOnInit(): void {
    this.loadReportPeriod([1, 2, 3]);
  }

  loadReportPeriod(ids: number[]) {
    if (!ids || ids.length === 0) {
      console.error('Error: no ids provided');
      return; // Maneja el caso cuando no se proporcionan ids
    }
    this.reportPeriodService.getReportPeriods(ids).subscribe({
      next: (data) => {
        this.reportPeriod = data;
        this.loadResume();
      },
      error: (error) => {
        console.error('Error loading report periods:', error);
      },
    });
  }

  loadResume() {
    // Crea los gráficos para las expensas ordinarias y extraordinarias
    if (this.reportPeriod) {
      this.createChartResume(
        'resume-ordinary',
        this.reportPeriod.resume.ordinary || [],
        this.reportPeriod.resume.extraordinary || [],
        'chart-container-ordinary'
      );
    }
    this.createChartPeriods(
      `chart-container-periods`,
      this.reportPeriod?.periods || [],
      'chart-container-periods'
    );
  }

  createChartResume(
    chartId: string,
    ordinary: CategoryData[],
    extraordinary: CategoryData[],
    element: string
  ): any {
    const labels = ordinary.map((item) => item.category); // Obtener las categorías

    // Obtener los valores de `totalAmount` de los datos ordinarios y extraordinarios
    let ordinaryValues: number[] = [];
    let extraordinaryValues: number[] = [];
    if (this.typeFilter == 'Monto') {
      ordinaryValues = ordinary.map((item) => item.data.totalAmount);
      extraordinaryValues = extraordinary.map((item) => item.data.totalAmount);
    }
    if (this.typeFilter == 'Porcentaje') {
      ordinaryValues = ordinary.map((item) => item.data.percentage);
      extraordinaryValues = extraordinary.map((item) => item.data.percentage);
    }
    if (this.typeFilter == 'Promedio') {
      ordinaryValues = ordinary.map((item) => item.data.average);
      extraordinaryValues = extraordinary.map((item) => item.data.average);
    }
    // Datos del gráfico
    const chartData: ChartData<'radar'> = {
      labels: labels,
      datasets: [
        {
          label: 'Ordinarias ', // Etiqueta para las datos ordinarios
          data: ordinaryValues ,
          borderColor: '#33FF57', // Color de las líneas para los datos ordinarios
          backgroundColor: 'rgba(51, 255, 87, 0.2)', // Color de fondo para las áreas ordinarias
          borderWidth: 2,
          pointBackgroundColor: '#33FF57', // Color de los puntos en las líneas
          pointBorderColor: '#33FF57',
        },
        {
          label: 'Extraordinarias ', // Etiqueta para los datos extraordinarios
          data: extraordinaryValues ,
          borderColor: '#FF5733', // Color de las líneas para los datos extraordinarios
          backgroundColor: 'rgba(255, 87, 51, 0.2)', // Color de fondo para las áreas extraordinarias
          borderWidth: 2,
          pointBackgroundColor: '#FF5733', // Color de los puntos en las líneas
          pointBorderColor: '#FF5733',
        },
      ],
    };
    const chartOptions: ChartOptions = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Comparación de Ordinarias y Extraordinarias',
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              return `${tooltipItem.label}: ${tooltipItem.raw}`;
            },
          },
        },
      },
    };

    try {
      let canvas
            const parentElement = document.getElementById(element); // Obtén el elemento padre

      if (parentElement) {
        // Elimina todos los hijos del contenedor
        while (parentElement.firstChild) {
          parentElement.removeChild(parentElement.firstChild);
        }
      
        // Crea el canvas y añádelo
         canvas= document.createElement('canvas');
        canvas.id = chartId; // Asigna un ID único para cada gráfico
        parentElement.appendChild(canvas); // Añade el canvas al contenedor
      }

      // Crear el gráfico con el nuevo canvas
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        const chart = new Chart(ctx, {
          type: 'bar', // Gráfico de tipo torta
          data: chartData,
          options: chartOptions,
        });

        // Guardar la instancia del gráfico para posibles manipulaciones posteriores
        this.chartInstances.push(chart);
        return chart; // Devolver la instancia del gráfico
      }
    } catch (err) {
      console.log('Error creating chart:', err);
    }
  }

  createChartPeriods(chartId: string, periods: Resume[], element: string): any {
    // Obtener las categorías comunes de todos los períodos (suponiendo que las categorías no cambian entre períodos)
    const labels = periods[0].ordinary.map((item) => item.category);

    // Crear los datos para las barras "Ordinarias"
    const ordinaryDatasets = periods.map((periodData, index) => { 
      let data:number[] = []
      if(this.typeFilter=="Monto"){
          data = periodData.ordinary.map((item) => item.data.totalAmount)
      }
      if(this.typeFilter=="Porcentaje"){
        data = periodData.ordinary.map((item) => item.data.percentage)
      }
      if(this.typeFilter=="Promedio"){
        data = periodData.ordinary.map((item) => item.data.average)
      }

      return {
        Title: 'Ordinarias',
        label: `${periodData.period.month}/${periodData.period.year} `,
        data: data
      };
    });

    // Crear los datos para las barras "Extraordinarias"
    const extraordinaryDatasets = periods.map((periodData, index) => {
        let data:number[]=[]
      if(this.typeFilter=="Monto"){
          data = periodData.ordinary.map((item) => item.data.totalAmount)
      }
      if(this.typeFilter=="Porcentaje"){
        data = periodData.ordinary.map((item) => item.data.percentage)
      }
      if(this.typeFilter=="Promedio"){
        data = periodData.ordinary.map((item) => item.data.average)
      }
      return {
        Title: 'Extraordinarias',
        label: `${periodData.period.month}/${periodData.period.year} `,
        data: data
      };
    });

    // Datos del gráfico "Ordinarias"
    const ordinaryChartData: ChartData<'bar'> = {
      labels: labels,
      datasets: ordinaryDatasets,
    };

    // Datos del gráfico "Extraordinarias"
    const extraordinaryChartData: ChartData<'bar'> = {
      labels: labels,
      datasets: extraordinaryDatasets,
    };

    const ordinaryChartOptions: ChartOptions = {
      responsive: true,
      indexAxis: 'y',  // Cambia la orientación a horizontal
      plugins: {
        title: {
          display: true,
          text: 'Ordinarias',
        },
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`;
            },
          },
        },
      },
    };

    // Opciones del gráfico "Extraordinarias"
    const extraordinaryChartOptions: ChartOptions = {
      responsive: true,
      indexAxis: 'y',  // Cambia la orientación a horizontal
      plugins: {
        title: {
          display: true,
          text: 'Extraordinarias',
        },
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`;
            },
          },
        },
      },
    };

    try {
      // Crear un nuevo canvas para cada gráfico
      const parentElement = document.getElementById(element);

      // Verificar que el contenedor existe
      if (parentElement) {
        // Eliminar todos los hijos del contenedor
        while (parentElement.firstChild) {
          parentElement.removeChild(parentElement.firstChild);
        }
      
        // Crear un nuevo canvas para cada gráfico
        const ordinaryCanvas = document.createElement('canvas');
        ordinaryCanvas.id = `${chartId}-ordinary`;
        parentElement.appendChild(ordinaryCanvas);
      
        const extraordinaryCanvas = document.createElement('canvas');
        extraordinaryCanvas.id = `${chartId}-extraordinary`;
        parentElement.appendChild(extraordinaryCanvas);
      
        // Crear el gráfico de barras "Ordinarias"
        const ordinaryCtx = ordinaryCanvas.getContext('2d');
        if (ordinaryCtx) {
          const ordinaryChart = new Chart(ordinaryCtx, {
            type: 'bar',
            data: ordinaryChartData,
            options: ordinaryChartOptions,
          });
          this.chartInstances.push(ordinaryChart);
        }
      
        // Crear el gráfico de barras "Extraordinarias"
        const extraordinaryCtx = extraordinaryCanvas.getContext('2d');
        if (extraordinaryCtx) {
          const extraordinaryChart = new Chart(extraordinaryCtx, {
            type: 'bar',
            data: extraordinaryChartData,
            options: extraordinaryChartOptions,
          });
          this.chartInstances.push(extraordinaryChart);
        }
      }

      return null;
    } catch (err) {
      console.log('Error creating chart:', err);
    }
  }
  // loadSelect() {
  //   forkJoin({
  //     periodos: this.periodService.get(),
  //   }).subscribe({
  //     next: ({ periodos }) => {
  //       this.periodos = periodos;
  //       this.periodosFilters = periodos.map((periodo) => ({
  //         value: periodo.id.toString(),
  //         label: `${periodo.month}/${periodo.year}`,
  //       }));
  //     },
  //   });
  // }

  /**
   * esto está "mockeado" para devolver los del periodo de id 1
   */

  // onFilterTextBoxChanged($event: Event) {}
  // filterChange($event: Record<string, any>) {
  //   // Aquí puedes obtener los IDs seleccionados
  //   this.idsTosearch = $event['period'] || []; // 'period' es el nombre del filtro que hemos usado en el checkbox
  //   console.log(this.idsTosearch);
  // }

  // //expenses: Expense[] = [];
  // totalAmount = 0;
  // averageAmount = 0;

  // barChartData: ChartData = {
  //   labels: [],
  //   datasets: [
  //     {
  //       label: 'Monto Total',
  //       data: [],
  //       backgroundColor: '#0d6efd',
  //     },
  //   ],
  // };

  // pieChartData: ChartData = {
  //   labels: [],
  //   datasets: [
  //     {
  //       data: [],
  //       backgroundColor: [
  //         '#0d6efd',
  //         '#6610f2',
  //         '#6f42c1',
  //         '#d63384',
  //         '#dc3545',
  //       ],
  //     },
  //   ],
  // };
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

  // createPieChart(data: ReportPeriod) {
  //   const ordinaryData = data.resume.ordinary.map((o) => ({
  //     category: o.category,
  //     percentage: o.data.percentage,
  //   }));
  //   const extraordinaryData = data.resume.extraordinary.map((e) => ({
  //     category: e.category,
  //     percentage: e.data.percentage,
  //   }));
  // }

  // updateCharts() {
  //   // Procesar datos para gráfico de barras (por tipo de lote)
  //   const lotTotals = this.expenses.reduce((acc, expense) => {
  //     acc[expense.typePlot] =
  //       (acc[expense.typePlot] || 0) + expense.totalAmount;
  //     return acc;
  //   }, {} as Record<string, number>);

  //   this.barChartData.labels = Object.keys(lotTotals);
  //   this.barChartData.datasets[0].data = Object.values(lotTotals);

  //   // Procesar datos para gráfico de torta (por tipo de expensa)
  //   const expenseTypes = this.expenses.reduce((acc, expense) => {
  //     acc[expense.billType] =
  //       (acc[expense.billType] || 0) + expense.totalAmount;
  //     return acc;
  //   }, {} as Record<string, number>);

  //   this.pieChartData.labels = Object.keys(expenseTypes);
  //   this.pieChartData.datasets[0].data = Object.values(expenseTypes);
  // }

  // calculateSummary() {
  //   this.totalAmount = this.expenses.reduce(
  //     (sum, expense) => sum + expense.totalAmount,
  //     0
  //   );
  //   this.averageAmount = this.totalAmount / this.expenses.length;
  //   // Combine both arrays para un solo gráfico
  //   const allData = [...this.ordinaryData, ...this.extraordinaryData];
  //   const labels = allData.map(
  //     (item) => `${item.category} (${item.percentage.toFixed(2)}%)`
  //   );
  //   const percentages = allData.map((item) => item.percentage);

  //   // Crear gráfico de torta
  //   new Chart('myPieChart', {
  //     type: 'pie',
  //     data: {
  //       labels: labels,
  //       datasets: [
  //         {
  //           label: 'Distribución porcentual de gastos',
  //           data: percentages,
  //           backgroundColor: [
  //             '#FF6384',
  //             '#36A2EB',
  //             '#FFCE56',
  //             '#4BC0C0',
  //             '#9966FF',
  //             '#FF9F40',
  //           ],
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true,
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //         },
  //       },
  //     },
  //   });
  // }
}
