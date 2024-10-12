import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import LiquidationExpense from '../../models/liquidationExpense';
import { LiquidationExpenseService } from '../../services/liquidation-expense.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PeriodSelectComponent } from '../selects/period-select/period-select.component';
import { CommonModule } from '@angular/common';
import { ExpensesModalComponent } from '../expenses-modal/expenses-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-expenses-liquidation-expense',
  standalone: true,
  imports: [PeriodSelectComponent, CommonModule, ExpensesModalComponent],
  templateUrl: './expenses-liquidation-expense.component.html',
  styleUrl: './expenses-liquidation-expense.component.css',
})
export class ExpensesLiquidationExpenseComponent implements OnInit {
  liquidationExpensesService: LiquidationExpenseService = inject(
    LiquidationExpenseService
  );
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  liquidationExpensesList: LiquidationExpense[] = [];
  id: number | null = null;
  selectedItemId: number | null = null;
  isModalVisible = false;
  selectedPeriodId: number | null = null;
//USO DEL MODAL CORRECTO.
private modalService = inject(NgbModal);

  open(content: TemplateRef<any>, id:number|null) {
    this.selectedItemId=id
    const modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    });

    modalRef.componentInstance.title = 'Delete Item';

    modalRef.componentInstance.onAccept.subscribe(() => {
      this.closeLiquidationPeriod();
    });
  }
  //modal

  ngOnInit(): void {
    this.loadId();
    this.loadList(this.id);
  }
  private loadId(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = Number(params.get('id')); 
      console.log('Retrieved ID:', this.id);
    });
    console.log(this.liquidationExpensesList);
  }
  private loadList(id: number | null) {
    if (id) {
      this.liquidationExpensesService
        .get(id)
        .subscribe((data: LiquidationExpense[]) => {
          this.liquidationExpensesList = data;
        });
    }
  }
  selectPeriodChange(id: any) {
    this.router.navigate([`/liquidation-expense/${id}`]).then(() => {
      this.loadList(id);
    });
  }

  closeLiquidation(id: number | null) {
    if (id) {
      console.log(id);
      this.liquidationExpensesService.putCloseLiquidation(id).subscribe({
        next: () => {
          console.log('Liquidación cerrada exitosamente');
          this.loadList(this.id);
        },
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
        });
      this.selectedItemId = null;
    }
  }

  seeDetail(id: number | null) {
    if (id === null) return;
    this.router.navigate([`liquidation-expense/details/${id}`]);
  }
}
