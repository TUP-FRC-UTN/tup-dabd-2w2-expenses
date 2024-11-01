// import { AddChargeComponent } from './components/cargo/expenses-add-charge/add-charge.component';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
// import { ListChargesComponent } from './components/cargo/expenses-list-charges/list-charges.component';
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {MainLayoutComponent, NavbarComponent, NavbarItem, SidebarComponent, ToastsContainer} from 'ngx-dabd-grupo01';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NgbModalModule, ToastsContainer, NavbarComponent, SidebarComponent, MainLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'expenses';


  navbarMenu: NavbarItem[] = [
    {
      label: 'Expensas',
      sidebarMenu: [
        {
          label: 'Gastos',
          // routerLink: '/gastos',
          subMenu: [
            { label: 'Nuevo', routerLink: '/gastos/nuevo' },
            { label: 'Listado', routerLink: '/gastos' },
            { label: 'Categorias', routerLink: '/gastos/categorias' },
            // { label: 'Reclamos', routerLink: '/claim' },
            // { label: 'Tipos de Sanciones', routerLink: '/sanctionType' },
          ],
        },
        {
          label: 'Cargos',
          subMenu: [
            { label: 'Nuevo', routerLink: '/cargos/nuevo' },
            { label: 'Listado', routerLink: '/cargos' },
            // { label: 'Infracciones', routerLink: '/infraction' },
            // { label: 'Reclamos', routerLink: '/claim' },
            // { label: 'Tipos de Sanciones', routerLink: '/sanctionType' },
          ],
        },
        {
          label: 'Periodo',
          subMenu: [
            { label: 'Listado', routerLink: '/periodo' },
            // { label: 'Roles', routerLink: '/role' },
            // { label: 'Lotes', routerLink: '/lot' },
          ]
        },
        {
          label: 'Expensas',
          subMenu: [
            { label: 'Listado', routerLink: '/expenses' },
            // { label: 'Roles', routerLink: '/role' },
            // { label: 'Lotes', routerLink: '/lot' },
          ]
        }
      ],
    },

  ];
}
