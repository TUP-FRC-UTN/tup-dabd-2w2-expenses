import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ExpensesExpensesNavComponent } from '../../navs/expenses-expenses-nav/expenses-expenses-nav.component';
import { ExpensesPeriodNavComponent } from '../../navs/expenses-period-nav/expenses-period-nav.component';
import { PeriodService } from '../../../services/period.service';
import Period from '../../../models/period';
import { NgClass } from '@angular/common';
import { ExpensesModalComponent } from '../../modals/expenses-modal/expenses-modal.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModalComponent } from '../../modals/ng-modal/ng-modal.component';
import { Page } from '../../../services/expense.service';
import { generateNumberArray } from '../../../utils/generateArrayNumber';
import { ExpensesStatePeriodStyleComponent } from '../../expenses-state-period-style/expenses-state-period-style.component';

@Component({
  selector: 'app-expenses-period-list',
  standalone: true,
  imports: [ExpensesPeriodNavComponent,ExpensesStatePeriodStyleComponent, NgClass, ExpensesModalComponent, NgModalComponent, NgbModule ],
  templateUrl: './expenses-period-list.component.html',
  styleUrl: './expenses-period-list.component.css',
})
export class ExpensesPeriodListComponent implements OnInit {
  private readonly periodService: PeriodService = inject(PeriodService);
  listOpenPeriod: Period[] = [];
  listPeriod: Period[] = [];  
  cantPages: number[] = [];
  indexActive = 1;
  size = 10;
  idClosePeriod: number | null = null;
  private state:string|null=null
  private modalService = inject(NgbModal);
  currentPage:number =1
  typeFilter:string|null=null
  ngOnInit(): void {
    this.loadPaged(1);
  }



  loadPaged(page: number) {
    page =page -1
    this.periodService.getPage(this.size, page,this.state).subscribe((data) => {
      this.listPeriod = data.content;
      this.cantPages = generateNumberArray(data.totalPages)
    
    });

  }

  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.size = Number(selectElement.value);
    this.loadPaged(this.indexActive)
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

  changeStateQuery=(text:string|null)=>{
    this.state=text
    this.loadPaged(this.indexActive)
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

  selectFilter(text:string){
  
    this.typeFilter=text
  }
}
