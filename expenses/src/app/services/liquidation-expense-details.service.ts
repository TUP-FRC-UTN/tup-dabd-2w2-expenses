import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../../enviroment';
import { Observable } from 'rxjs';
import LiquidationExpense from '../models/liquidationExpense';

@Injectable({
  providedIn: 'root'
})
export class LiquidationExpenseDetailsService {

  private readonly http = inject(HttpClient)

  private apiUrl = enviroment.expenses_details

  get(id:number): Observable<LiquidationExpense>{
    return this.http.get<LiquidationExpense>(`${this.apiUrl}?expense_id=${id}`)
  }
}
