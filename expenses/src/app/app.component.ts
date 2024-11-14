import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {MainLayoutComponent, NavbarComponent, NavbarItem, SidebarComponent, ToastsContainer} from 'ngx-dabd-grupo01';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

@Component({
  providers: [provideCharts(withDefaultRegisterables())],
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NgbModalModule, ToastsContainer, NavbarComponent, SidebarComponent, MainLayoutComponent, BaseChartDirective],
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
            { label: 'Categorías de gastos', routerLink: '/gastos/categorias' },
            { label: 'Reporte de gastos', routerLink: '/gastos/report' },

          ],
        },
        {
          label: 'Cargos',
          subMenu: [
            { label: 'Lista de cargos', routerLink: '/cargos' },
            { label: 'Categorías de cargos', routerLink: '/cargos/categorias' }
          ],
        },
        {
          label: 'Periodo',
          subMenu: [
            { label: 'Lista de periodos', routerLink: '/periodo' },
            { label: 'Histórico de expensas', routerLink: '/expenses' },
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

