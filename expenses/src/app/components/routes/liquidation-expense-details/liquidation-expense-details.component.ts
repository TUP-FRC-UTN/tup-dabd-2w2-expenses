import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LiquidationExpenseDetailsService } from '../../../services/liquidation-expense-details.service';
import LiquidationExpenseDetail from '../../../models/liquidationExpenseDetail';

@Component({
  selector: 'app-liquidation-expense-details',
  standalone: true,
  imports: [],
  templateUrl: './liquidation-expense-details.component.html',
  styleUrl: './liquidation-expense-details.component.css'
})
export class LiquidationExpenseDetailsComponent implements OnInit{

  private readonly router = inject(Router);
  private readonly service = inject(LiquidationExpenseDetailsService);
  private readonly route = inject(ActivatedRoute);
  liquidationExpenseDetail: LiquidationExpenseDetail = new LiquidationExpenseDetail();

  ngOnInit(): void {

    this.loadLiquidationExpenseDetails();
  }

  private loadLiquidationExpenseDetails() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && !isNaN(Number(id))) {
        this.service.get(Number(id)).subscribe((data: LiquidationExpenseDetail) => {
          this.liquidationExpenseDetail = data;

          console.log(this.liquidationExpenseDetail);

        });
      }
    });
  }

}
