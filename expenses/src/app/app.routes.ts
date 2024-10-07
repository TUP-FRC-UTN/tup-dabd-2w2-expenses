import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LiquidationExpenseComponent } from './components/routes/liquidation-expense/liquidation-expense.component';

export const routes: Routes = [
    { path: 'expense/:id', component:LiquidationExpenseComponent },
    { path: '', redirectTo: '', pathMatch: 'full' }, // Asegúrate de que no esté causando conflictos
    { path: '**', redirectTo: '/expense/1' },
];
