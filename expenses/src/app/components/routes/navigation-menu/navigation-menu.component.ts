import {Component, inject, OnInit} from '@angular/core';
import {MenuItems, NavbarComponent} from "ngx-dabd-2w1-core";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [
    NavbarComponent  ],
  templateUrl: './navigation-menu.component.html',
  styleUrl: './navigation-menu.component.css'
})
export class NavigationMenuComponent implements OnInit {
  private readonly route = inject(Router); 

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
    console.log(key)
    if(key==="liquidation-expense"){
      this.route.navigate(["expense/3"])
    } 
    this.visibleSection = key;
    this.items.forEach(value => value.key == key ? value.active = true : value.active = false)
  }

  ngOnInit(): void {
    this.onMenuVisited('bills')
  }
}
