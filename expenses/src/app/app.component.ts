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
            { label: 'Lista', routerLink: '/gastos' },
            { label: 'Categorias', routerLink: '/gastos/categorias' }
            

          ],
        },
        {
          label: 'Cargos',
          subMenu: [
            { label: 'Lista', routerLink: '/cargos' },
            { label: 'Categorias', routerLink: '/cargos/categorias' }
          ],
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

