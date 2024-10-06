import { AddChargeComponent } from './components/cargo/add-charge/add-charge.component';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BorrarItemComponent } from './components/borrar-item/borrar-item.component';
import { ListChargesComponent } from './components/cargo/list-charges/list-charges.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BorrarItemComponent, AddChargeComponent, ListChargesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'expenses';
}
