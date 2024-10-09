import {Component, inject, OnInit} from '@angular/core';
import {MenuItems, NavbarComponent} from "ngx-dabd-2w1-core";
import {LiquidationExpenseComponent} from "../liquidation-expense/liquidation-expense.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [
    NavbarComponent,
    LiquidationExpenseComponent
  ],
  templateUrl: './navigation-menu.component.html',
  styleUrl: './navigation-menu.component.css'
})
export class NavigationMenuComponent implements OnInit {

  private readonly router = inject(Router);

  visibleSection: string = '';

  items: MenuItems[] = [
    {
      key: 'bills',
      name: 'Gastos',
      icon: 'alarm',
      active: false,
      disabled: false
    },
    {
      key: 'charges',
      name: 'Cargos',
      active: false,
      disabled: false
    },
    {
      key: 'liquidation-expense',
      name: 'Expensas',
      active: false,
      disabled: false
    },
    {
      key: 'accounts',
      name: 'Cuentas',
      active: false,
      disabled: false
    }
  ];

  onMenuVisited(key: string) {
    this.router.navigate(['expense/1'])
  }

  ngOnInit(): void {
    this.onMenuVisited('bills')
  }
}
