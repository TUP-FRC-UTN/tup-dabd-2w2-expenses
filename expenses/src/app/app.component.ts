import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {MainLayoutComponent, NavbarComponent, NavbarItem, SidebarComponent, ToastsContainer} from 'ngx-dabd-grupo01';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NgbModalModule, ToastsContainer, NavbarComponent, SidebarComponent, MainLayoutComponent, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'expenses';

  navbarMenu: NavbarItem[] = [
    {
      label: 'Accesos'
    },
    {
      label: 'Empleados'
    },
    {
      label: 'Gastos',
      sidebarMenu: [
        {
          label: 'Gastos',
          subMenu: [
            { label: 'Lista de gastos', routerLink: '/gastos' },
            { label: 'Categorias', routerLink: '/gastos/categorias' }
          ],
        },
        {
          label: 'Cargos',
          routerLink: '/cargos'
        },
        {
          label: 'Periodo',
          subMenu: [
            { label: 'Lista de periodos', routerLink: '/periodo' },
            { label: 'Historico de expensas', routerLink: '/expenses' },
            { label: 'Reporte de expensas', routerLink: '/expenses/report' },
          ]
        },
      ],
    },
    {
      label: 'Inventario'
    },
    {
      label: 'Multas y obras'
    },
    {
      label: 'Notificaciones'
    },
    {
      label: 'Proveedores'
    },
    {
      label: 'Tickets'
    },
    {
      label: 'Usuarios'
    }
  ];
}

