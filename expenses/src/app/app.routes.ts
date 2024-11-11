import { Routes } from '@angular/router';
// import { ListChargesComponent } from './components/cargo/expenses-list-charges/list-charges.component';
// import { AddChargeComponent } from './components/cargo/expenses-add-charge/add-charge.component';
// import {AddBillComponent} from "./components/expenses_bills/expenses-add-bill/add-bill.component";
import { LiquidationExpenseDetailsComponent } from './components/expenses-period/expenses-liquidation-details/expenses-liquidation-details.component';
import { ExpensesLiquidationComponent } from './components/expenses-period/expenses-liquidation/expenses-liquidation.component';
import { ExpensesListComponent } from './components/expenses-period/expenses-list/expenses-list.component';
import {
  ExpensesListChargesComponent
} from "./components/expenses-charges/expenses-list-charges/expenses-list-charges.component";
import {
  ExpensesAddChargeComponent
} from "./components/expenses-charges/expenses-add-charge/expenses-add-charge.component";
import {ExpensesAddBillComponent} from "./components/expenses-bills/expenses-add-bill/expenses-add-bill.component";
import {
  ExpensesCategoryBillComponent
} from "./components/expenses-bills/expenses-category-bill/expenses-category-bill.component";
import {
  ExpensesPeriodListComponent
} from "./components/expenses-period/expenses-period-list/expenses-period-list.component";
import {ExpensesPeriodComponent} from "./components/expenses-period/expenses-period/expenses-period.component";

import {
  ExpensesReportComponent
} from "./components/expenses-period/expenses-report/expenses-report/expenses-report.component";

import { ExpensesListBillsComponent } from './components/expenses-bills/expenses-list-bills/expenses-list-bills.component';
import { ExpensesListCategoryChargesComponent } from './components/expenses-charges/expenses-list-category-charges/expenses-list-categorycharge.component';
import { ExpensesReportChargesComponent } from './components/expenses-charges/expenses-report-charges/expenses-report-charges/expenses-report-charges.component';

// import { ExpensesPeriodListComponent } from './components/period/expenses-period-list/expenses-period-list.component';
// import {CategoryBillComponent} from "./components/expenses_bills/expenses-category-bill/category-bill.component";
//import { GetByPeriodComponent } from './components/expensas/getByPeriod/get-by-period/get-by-period.component';
// import { ExpensesPeriodExpensesComponent } from './components/period/expenses-period/expenses-period.component';
// import { ListBillsComponent } from './components/expenses_bills/expenses-list-bills/list-bills.component';


export const routes: Routes = [
  // Ruta periodos - manejo del estado del periodo
  { path: 'periodo', component: ExpensesPeriodListComponent },
  { path: 'periodo/:period_id/expensas', component: ExpensesListComponent },
  { path: 'periodo/:period_id/liquidacion', component: ExpensesLiquidationComponent },
  { path: 'periodo/:period_id/gastos', component: LiquidationExpenseDetailsComponent },

  // Ruta expenses - CRUD de expensas
  { path: 'expenses', component: ExpensesListComponent },
  {path: 'expenses/report', component: ExpensesReportComponent},
  { path: 'expenses/nuevo', component: ExpensesListChargesComponent },
  { path: 'expenses/modificar/:id', component: ExpensesListChargesComponent },

  // Rutas cargos - CRUD de cargos
  { path: 'cargos', component: ExpensesListChargesComponent },
  { path: 'cargos/nuevo', component: ExpensesAddChargeComponent },
  { path: 'cargos/modificar/:id', component: LiquidationExpenseDetailsComponent },
  { path: 'cargos/categorias', component: ExpensesListCategoryChargesComponent },
  { path: 'cargos/reportes', component: ExpensesReportChargesComponent },

  // Ruta bills - CRUD de gastos
  { path: 'gastos', component: ExpensesListBillsComponent },
  { path: 'gastos/nuevo', component: ExpensesAddBillComponent },
  { path: 'gastos/modificar/:id', component: ExpensesAddBillComponent },
  { path: 'gastos/categorias', component: ExpensesCategoryBillComponent },

  // Ruta por defecto o de redirección (opcional)
  // { path: '', redirectTo: '', pathMatch: 'full' },
  // { path: '**', redirectTo: '' },
];

