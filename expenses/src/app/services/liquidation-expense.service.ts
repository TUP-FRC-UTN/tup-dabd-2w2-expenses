import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import LiquidationExpense from '../models/liquidationExpense';
import { enviroment } from '../../../enviroment';

@Injectable({
  providedIn: 'root'
})
export class LiquidationExpenseService {

  private readonly http = inject(HttpClient)

  private apiUrl = enviroment.expenses

  get(id:number): Observable<LiquidationExpense[]>{
    return this.http.get<LiquidationExpense[]>(`${this.apiUrl}calculate/${id}`,)
  }
  getById(id:number):Observable<LiquidationExpense>{
    return this.http.get<LiquidationExpense>(`${this.apiUrl}find/${id}`,)
  }
}
