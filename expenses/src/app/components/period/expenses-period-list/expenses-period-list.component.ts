import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ExpensesExpensesNavComponent } from '../../navs/expenses-expenses-nav/expenses-expenses-nav.component';
import { ExpensesPeriodNavComponent } from '../../navs/expenses-period-nav/expenses-period-nav.component';
import { PeriodService } from '../../../services/period.service';
import Period from '../../../models/period';
import { NgClass } from '@angular/common';
import { ExpensesModalComponent } from '../../modals/expenses-modal/expenses-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgModalComponent } from '../../modals/ng-modal/ng-modal.component';

@Component({
  selector: 'app-expenses-period-list',
  standalone: true,
  imports: [ExpensesPeriodNavComponent, NgClass, ExpensesModalComponent, NgModalComponent],
  templateUrl: './expenses-period-list.component.html',
  styleUrl: './expenses-period-list.component.css',
})
export class ExpensesPeriodListComponent implements OnInit {
  private readonly periodService: PeriodService = inject(PeriodService);
  listOpenPeriod: Period[] = [];
  listPeriod: Period[] = [];
  cantPages: number[] = [];
  indexActive = 0;
  size = 10;
  idClosePeriod: number | null = null;
  private modalService = inject(NgbModal);

  ngOnInit(): void {
    this.loadPeriod();
    this.loadPaged(0);
  }

  loadPeriod() {
    this.periodService.getOpens().subscribe((data) => {
      this.listOpenPeriod = data;
    });
  }

  loadPaged(page: number) {
    this.periodService.getPage(this.size, page).subscribe((data) => {
      this.listPeriod = data;
    });

    this.getPages(this.size);
  }

  getPages(size: number) {
    this.periodService.get().subscribe((data) => {
      let len = data.length / size;

      len = Math.ceil(len);

      this.cantPages = Array(len)
        .fill(0)
        .map((x, i) => i);
    });
  }

  open(content: TemplateRef<any>, id: number | null) {
    this.idClosePeriod = id;
    const modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    });
    modalRef.componentInstance.onAccept.subscribe(() => {
      this.closePeriod();
    });   
     this.idClosePeriod = null;
  }

  changeIndex(cant: number) {
    this.indexActive = cant;
    this.loadPaged(cant);
  }

  newPeriod() {
    this.periodService.new().subscribe((data) => {
      this.ngOnInit();
    });
  }
  openErrorModal(err:any) {
    const modalRef = this.modalService.open(NgModalComponent);
    modalRef.componentInstance.title = 'Error';
    modalRef.componentInstance.message = err?.error.message;
  }

  closePeriod() {
    console.log(this.idClosePeriod);
  
    if (this.idClosePeriod) {
      this.periodService
        .closePeriod(this.idClosePeriod)
        .subscribe({
          next: (data) => {
            // Aquí puedes manejar el éxito si es necesario
            console.log('Period closed successfully');
          },
          error: (err) => {
            console.log(err)
            this.openErrorModal(err);
          }
        });
  
      this.idClosePeriod = null;
    }
  }
}
