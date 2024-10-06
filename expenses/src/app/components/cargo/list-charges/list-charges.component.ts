import { Component, inject, OnInit } from '@angular/core';
import { Charge } from '../../../models/charge';
import { ChargeService } from '../../../services/charge.service';

@Component({
  selector: 'app-list-charges',
  standalone: true,
  imports: [],
  templateUrl: './list-charges.component.html',
  styleUrl: './list-charges.component.css'
})
export class ListChargesComponent implements OnInit{
  
  charges: Charge[] = [];
  private chargeService = inject(ChargeService);

  ngOnInit(): void {
    this.chargeService.getCharges().subscribe((charges) => {
      this.charges = charges
    })
  }
}
