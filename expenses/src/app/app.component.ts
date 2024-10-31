import { AddChargeComponent } from './components/cargo/expenses-add-charge/add-charge.component';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ListChargesComponent } from './components/cargo/expenses-list-charges/list-charges.component';
import {NavigationMenuComponent} from "./components/routes/navigation-menu/navigation-menu.component";
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {NavbarComponent, SidebarComponent, ToastsContainer} from 'ngx-dabd-grupo01';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NgbModalModule, ToastsContainer, NavbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'expenses';
}
