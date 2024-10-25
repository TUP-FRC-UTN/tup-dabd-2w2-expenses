import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import LiquidationExpense from '../models/liquidationExpense';

@Injectable({
  providedIn: 'root',
})
export class LiquidationExpenseService {
  private readonly http = inject(HttpClient);

  private apiUrl = 'http://localhost:8088/liquidation/';

  get(id:number): Observable<LiquidationExpense[]>{
    return this.http.get<LiquidationExpense[]>(`${this.apiUrl}calculate/${id}`,)
  }
  getById(id: number): Observable<LiquidationExpense> {
    return this.http.get<LiquidationExpense>(`${this.apiUrl}find/${id}`);
  }

  putCloseLiquidation(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}close/${id}`, null);
  }

  putCloseLiquidationExpensesPeriod(id: number): Observable<any> {
    return this.http.put(
      `http://localhost:8081/calculate/close/liquidation/${id}`,
      null
    );
  }
}
