import { AddChargeComponent } from './components/cargo/add-charge/add-charge.component';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ListChargesComponent } from './components/cargo/list-charges/list-charges.component';
import {NavigationMenuComponent} from "./components/routes/navigation-menu/navigation-menu.component";
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import { ToastsContainer } from 'ngx-dabd-grupo01';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NavigationMenuComponent, NgbModalModule,ToastsContainer],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'expenses';
}
