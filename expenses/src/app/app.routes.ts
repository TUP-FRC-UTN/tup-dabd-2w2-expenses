import { Routes } from '@angular/router';
import { ListChargesComponent } from './components/cargo/list-charges/list-charges.component';
import { AddChargeComponent } from './components/cargo/add-charge/add-charge.component';
import { LiquidationExpenseComponent } from './components/routes/liquidation-expense/liquidation-expense.component';
import { LiquidationExpenseDetailsComponent } from './components/routes/liquidation-expense-details/liquidation-expense-details.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    { path: 'expense/period/{period_id}', component:AppComponent }, // Ruta para productos
    { path: '', redirectTo: 'list-charges', pathMatch: 'full' }, // Redirigir a listar cargos
    { path: 'list-charges', component: ListChargesComponent },
    { path: 'add-charge', component: AddChargeComponent },
    { path: 'expense/:id', component:LiquidationExpenseComponent },
    { path: 'expense/details/:id', component:LiquidationExpenseDetailsComponent },
    //{ path: '', redirectTo: '', pathMatch: 'full' },
    //{ path: '**', redirectTo: '' },
  ];
