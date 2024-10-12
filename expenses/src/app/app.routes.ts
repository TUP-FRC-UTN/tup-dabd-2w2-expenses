import { Routes } from '@angular/router';
import { ListChargesComponent } from './components/cargo/list-charges/list-charges.component';
import { AddChargeComponent } from './components/cargo/add-charge/add-charge.component';
import { LiquidationExpenseComponent } from './components/liquidation-expense/liquidation-expense.component';
import { AppComponent } from './app.component';
import { ListBillsComponent } from './components/bills/list-bills/list-bills.component';
import { AddBillComponent } from './components/bills/add-bill/add-bill.component';

export const routes: Routes = [
    //{ path: '', component: AppComponent }, // Ruta raíz
    //{ path: 'expense/period/{period_id}', component:AppComponent }, // Ruta para productos
    { path: 'list-charges', component: ListChargesComponent },
    { path: 'add-charge', component: AddChargeComponent },
    { path: 'expense/:id', component:LiquidationExpenseComponent },
    {path: 'list-bills', component: ListBillsComponent},
    {path: 'add-bill', component: AddBillComponent},
    { path: '', redirectTo: 'list-charges', pathMatch: 'full' }, // Redirigir a listar cargos
    //{ path: '', redirectTo: '', pathMatch: 'full' },
    //{ path: '**', redirectTo: '/expense/1' },
  ];