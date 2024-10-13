import { Component, EventEmitter, Output } from '@angular/core';
import { listCharge, ChargeType } from '../../../models/chargesType';
@Component({
  selector: 'app-expense-charge-type-select',
  standalone: true,
  imports: [],
  templateUrl: './expense-charge-type-select.component.html',
  styleUrl: './expense-charge-type-select.component.css',
})
export class ExpenseChargeTypeSelectComponent {
  @Output() chargeType: EventEmitter<number> = new EventEmitter<number>(); // Emits the selected period ID

  listCharge: ChargeType[] = listCharge;

  onPeriodChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (selectedValue) {
      this.chargeType.emit(Number(selectedValue));
    }
  }
}
