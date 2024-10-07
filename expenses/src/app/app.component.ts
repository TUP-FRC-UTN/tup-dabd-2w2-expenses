import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import {NavigationMenuComponent} from "./components/routes/navigation-menu/navigation-menu.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationMenuComponent,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'expenses';
}
