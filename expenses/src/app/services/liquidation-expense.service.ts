import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import LiquidationExpense from '../models/liquidationExpense';

@Injectable({
  providedIn: 'root'
})
export class LiquidationExpenseService {

  private readonly http = inject(HttpClient)

  private apiUrl = "http://localhost:8081/liquidation/calculate"

  get(id:number): Observable<LiquidationExpense[]>{
    return this.http.get<LiquidationExpense[]>(`${this.apiUrl}/${id}`,)
  }
}
