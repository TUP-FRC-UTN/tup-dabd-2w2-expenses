import { Routes } from '@angular/router';
import { ListChargesComponent } from './components/cargo/list-charges/list-charges.component';
import { AddChargeComponent } from './components/cargo/add-charge/add-charge.component';

export const routes: Routes = [
    { path: '', component: AppComponent }, // Ruta raíz
    { path: 'expense/period/{period_id}', component:AppComponent }, // Ruta para productos
    { path: '', redirectTo: 'list-charges', pathMatch: 'full' }, // Redirigir a listar cargos
    { path: 'list-charges', component: ListChargesComponent },
    { path: 'add-charge', component: AddChargeComponent },
    { path: '**', redirectTo: '' } 
import { AppComponent } from './app.component';
import { LiquidationExpenseComponent } from './components/routes/liquidation-expense/liquidation-expense.component';

export const routes: Routes = [
    { path: 'expense/:id', component:LiquidationExpenseComponent },
    { path: '', redirectTo: '', pathMatch: 'full' }, 
    { path: '**', redirectTo: '/expense/1' },
];
