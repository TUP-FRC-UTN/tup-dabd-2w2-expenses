import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
    { path: '', component: AppComponent }, // Ruta raíz
    { path: 'expense/period/{period_id}', component:AppComponent }, // Ruta para productos
    { path: '**', redirectTo: '' } 
];
