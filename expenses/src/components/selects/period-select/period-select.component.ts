import { Component, inject, OnInit } from '@angular/core';
import { PeriodService } from '../../../services/period.service';
import Period from '../../../models/period';

@Component({
  selector: 'app-period-select',
  standalone: true,
  imports: [ ],
  templateUrl: './period-select.component.html',
  styleUrl: './period-select.component.css'
})
export class PeriodSelectComponent implements OnInit {

   periodList:Period[] =[]
  private periodService:PeriodService = inject(PeriodService)
  ngOnInit(): void {
    this.getListPeriod()
  }
  getListPeriod(){
    this.periodService.get().subscribe({
      next: (data: Period[]) => {
        this.periodList = data;
      },
      error: (error) => {
        console.error('Error al obtener los periodos:', error);
      }
    })
  }
}
