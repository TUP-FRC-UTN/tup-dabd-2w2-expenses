import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LiquidationExpenseComponent } from './components/routes/liquidation-expense/liquidation-expense.component';
import { LiquidationExpenseDetailsComponent } from './components/routes/liquidation-expense-details/liquidation-expense-details.component';

export const routes: Routes = [
  { path: 'expense/:id', component:LiquidationExpenseComponent },
  { path: 'expense/details/:id', component:LiquidationExpenseDetailsComponent },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
