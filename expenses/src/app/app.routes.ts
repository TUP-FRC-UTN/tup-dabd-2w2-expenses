import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LiquidationExpenseComponent } from './components/routes/liquidation-expense/liquidation-expense.component';

export const routes: Routes = [
    { path: 'expense/:id', component:LiquidationExpenseComponent }
];
