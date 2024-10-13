import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Bill } from '../../../models/bill';

@Component({
  selector: 'app-add-bill',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-bill.component.html',
  styleUrl: './add-bill.component.css'
})
export class AddBillComponent {

  bill?: Bill = undefined ;
  
}
