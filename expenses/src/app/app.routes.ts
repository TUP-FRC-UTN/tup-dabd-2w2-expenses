import { Routes } from '@angular/router';
import { ListChargesComponent } from './components/cargo/list-charges/list-charges.component';
import { AddChargeComponent } from './components/cargo/add-charge/add-charge.component';
import { LiquidationExpenseDetailsComponent } from './components/liquidation-expense-details/liquidation-expense-details.component';
import { AppComponent } from './app.component';
import { ExpensesLiquidationExpenseComponent } from './components/expenses-liquidation-expense/expenses-liquidation-expense.component';

export const routes: Routes = [
    { path: 'expense/period/{period_id}', component:AppComponent }, // Ruta para productos
    { path: '', redirectTo: 'list-charges', pathMatch: 'full' }, // Redirigir a listar cargos
    { path: 'list-charges', component: ListChargesComponent },
    { path: 'add-charge', component: AddChargeComponent },
    { path: 'liquidation-expense/details/:id', component:LiquidationExpenseDetailsComponent },
    { path: 'liquidation-expense', component:ExpensesLiquidationExpenseComponent },
    { path: 'liquidation-expense/:id', component:ExpensesLiquidationExpenseComponent },
    //{ path: '', redirectTo: '', pathMatch: 'full' },
    //{ path: '**', redirectTo: '' },
  ];
