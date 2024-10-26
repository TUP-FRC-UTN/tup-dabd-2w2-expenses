import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalLiquidationDetailComponent } from './modal-liquidation-detail/modal-liquidation-detail.component';
import { LiquidationExpenseService } from '../../../services/liquidation-expense.service';
import LiquidationExpense from '../../../models/liquidationExpense';
import { FormsModule } from '@angular/forms';
import { InfoModalComponent } from '../../modals/info-modal/info-modal.component';
import { NgModalComponent } from '../../modals/ng-modal/ng-modal.component';
import { BillService } from '../../../services/bill.service';

@Component({
  selector: 'app-liquidation-expense-details',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    CommonModule,
    FormsModule,
    InfoModalComponent,
    NgModalComponent
],
  templateUrl: './liquidation-expense-details.component.html',
  styleUrl: './liquidation-expense-details.component.css'
})
export class LiquidationExpenseDetailsComponent implements OnInit{

  private readonly location = inject(Location);
  private readonly service = inject(LiquidationExpenseService);
  private readonly billsService = inject(BillService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private modalService = inject(NgbModal);
  liquidationExpense: LiquidationExpense = new LiquidationExpense();

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  pages: number[] = [];


  ngOnInit(): void {
    this.loadLiquidationExpenseDetails();
  }

  private loadLiquidationExpenseDetails() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && !isNaN(Number(id))) {
        this.service.getById(Number(id)).subscribe((data: LiquidationExpense) => {
          this.liquidationExpense = data;
        });
      }
    });

    this.liquidationExpense.liquidation_expenses_details.forEach(detaill => {})
  }

  private getBills(itemsPerPage: number, page: number, period: number, category: number, type: number, status: string) {
    this.billsService.getAllBillsPaged(itemsPerPage, page, period, category, type, status).subscribe(data => {
      // this.liquidationExpense.liquidation_expenses_details.bills = data;
    })
  }



  goBack() {
    this.location.back();
  }


  //
  // Pagination
  //

  initializePagination() {
    this.totalItems = this.liquidationExpense.liquidation_expenses_details.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.initializePagination();
  }

  //
  // PDF Y Excel
  //

  downloadTable() {

  }

  imprimir() {

  }


  //
  // Modal
  //

  openModal() {
    const modalRef = this.modalService.open(ModalLiquidationDetailComponent);
  }

  showmodal(content: TemplateRef<any>) {
    const modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }



  edit(id: number | null) {
    console.log(id);

    if (id == null) return;
    this.router.navigate([`gastos/modificar/${id}`])
  }
}
