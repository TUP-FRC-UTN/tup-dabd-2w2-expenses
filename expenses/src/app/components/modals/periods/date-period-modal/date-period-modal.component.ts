import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PeriodService } from '../../../../services/period.service';
import { Observable, of } from 'rxjs';

function periodValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const fecha = new Date(control.value);
    if (isNaN(fecha.getTime())) {
      return { fechaInvalida: true };
    }

    const año = fecha.getFullYear();
    const mes = fecha.getMonth();
    const dia = fecha.getDate();

    const inicioMes = new Date(año, mes, 15);

    const finMes = new Date(año, mes + 1, 0);

    if (fecha >= inicioMes && fecha <= finMes) {
      return null;
    }

    return { periodValidatorError: true };
  };
}


@Component({
  selector: 'app-date-period-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './date-period-modal.component.html',
  styleUrl: './date-period-modal.component.css'
})
export class DatePeriodModalComponent {
  period: FormGroup;
  @Input() id?: number;

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private periodService: PeriodService
  ) {
    this.period = this.formBuilder.group({
      endDate: ['', {
        validators: [Validators.required, periodValidator()],
        updateOn: 'blur'
      }],
    });
  }



  savePeriod() {
    if (this.period.valid) {
      let period: {end_date: string} = this.period.value;

      if (this.id == null) {
        this.periodService.new(period).subscribe({
          next: (response: any) => {
            this.activeModal.close({
              success: true,
              message: 'El periodo se ha añadido correctamente.',
              data: response
            });
          },
          error: (error: any) => {
            let errorMessage = 'Ha ocurrido un error al añadir el periodo. Por favor, inténtelo de nuevo.';
            this.activeModal.close({
              success: false,
              message: errorMessage,
              error: error
            });
          }
        });
      } else {

      }
    } else {
      this.activeModal.close({
        success: false,
        message: 'Por favor, complete todos los campos requeridos correctamente.'
      });
    }
  }
}
