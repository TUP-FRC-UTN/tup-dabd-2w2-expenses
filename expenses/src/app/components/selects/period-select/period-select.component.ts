import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { PeriodService } from '../../../services/period.service';
import Period from '../../../models/period';

@Component({
  selector: 'app-period-select',
  standalone: true,
  imports: [],
  templateUrl: './period-select.component.html',
  styleUrl: './period-select.component.css',
})
export class PeriodSelectComponent implements OnInit {
  private servicePeriod: PeriodService = inject(PeriodService);
  periodList: Period[] = [];
  ngOnInit(): void {
    this.loadSelect();
  }
  @Output() periodSelected: EventEmitter<number> = new EventEmitter<number>(); // Emits the selected period ID

  private loadSelect() {
    this.servicePeriod.get().subscribe((data: Period[]) => {
      this.periodList = data;
    });
  }

  onPeriodChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; 
    const selectedValue = selectElement.value; 

    if (selectedValue) {
      this.periodSelected.emit(Number(selectedValue)); 
    }
  }
}
