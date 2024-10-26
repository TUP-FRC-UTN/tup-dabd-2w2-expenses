import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LiquidationExpenseService } from '../../../services/liquidation-expense.service';
import { PeriodSelectComponent } from '../../selects/period-select/period-select.component';
import { ExpensesModalComponent } from '../../modals/expenses-modal/expenses-modal.component';
import LiquidationExpense from '../../../models/liquidationExpense';
import { TableColumn, TableComponent } from 'ngx-dabd-grupo01';
import { ExpensesPeriodListComponent } from '../../period/expenses-period-list/expenses-period-list.component';
import { ExpensesPeriodNavComponent } from "../../navs/expenses-period-nav/expenses-period-nav.component";
import { NgModalComponent } from "../../modals/ng-modal/ng-modal.component";
@Component({
  selector: 'app-expenses-liquidation-expense',
  standalone: true,
  imports: [
    PeriodSelectComponent,
    CommonModule,
    ExpensesModalComponent,
    TableComponent,
    ExpensesPeriodListComponent,
    ExpensesPeriodNavComponent,
    NgModalComponent
],
  templateUrl: './expenses-liquidation-expense.component.html',
  styleUrl: './expenses-liquidation-expense.component.css',
})
export class ExpensesLiquidationExpenseComponent implements OnInit {
  liquidationExpensesService: LiquidationExpenseService = inject(
    LiquidationExpenseService
  );
  
  //table

  items: any[] = [];
  sizeOptions: number[] = [];
  type:string="Ordinarias"
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  liquidationExpensesList: LiquidationExpense[] = [];
  id: number | null = null;
  selectedItemId: number | null = null;
  isModalVisible = false;
  selectedPeriodId: number | null = null;
  //USO DEL MODAL CORRECTO.
  private modalService = inject(NgbModal);

  listLooking:LiquidationExpense[]=[]

  open(content: TemplateRef<any>, id: number | null) {
    this.selectedItemId = id;
    const modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    });



  }
  //modal
  changeStateQuery(text:string){
    this.type = text
    this.loadLookList()

  }

  loadLookList(){
    this.listLooking = this.liquidationExpensesList.filter(liq=>liq.bill_type?.name===this.type)
  }
  ngOnInit(): void {
    this.loadId();
    this.loadList(this.id);
    this.loadList(this.id);

  }

  


  private loadId(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = Number(params.get('period_id'));
    });
    console.log(this.liquidationExpensesList);
  }

  private loadList(id: number | null) {
    if (id) {
      this.liquidationExpensesService
        .get(id)
        .subscribe((data: LiquidationExpense[]) => {
          console.log(data)
          this.liquidationExpensesList = data;
          this.loadLookList()

        });
    }
  }


  closeLiquidation(id: number | null) {
    if (id) {
      console.log(id);
      this.liquidationExpensesService.putCloseLiquidation(id).subscribe({
        next: () => {
          console.log('Liquidación cerrada exitosamente');
          this.loadList(this.id);
        }
      });
    }
  }

  closeLiquidationPeriod() {
    if (this.selectedItemId) {
      this.liquidationExpensesService
        .putCloseLiquidationExpensesPeriod(this.selectedItemId)
        .subscribe({
          next: () => {
            this.loadList(this.id);
          },
        error:(err)=>{
          this.openErrorModal(err)
        }
        });
      this.selectedItemId = null;
    }
  }

  seeDetail(id: number | null,period_id:number|null) {
    if (id === null) return;
    
    this.router.navigate([`periodo/${period_id}/liquidacion/${id}`]);
  }
  openErrorModal(err:any) {
    console.log(err)
    const modalRef = this.modalService.open(NgModalComponent);
    modalRef.componentInstance.title = 'Error';
    modalRef.componentInstance.message = err?.error.message;
  }

}
