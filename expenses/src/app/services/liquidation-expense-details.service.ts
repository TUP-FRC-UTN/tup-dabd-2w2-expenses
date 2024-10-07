import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../../enviroment';
import { Observable } from 'rxjs';
import LiquidationExpenseDetail from '../models/liquidationExpenseDetail';

@Injectable({
  providedIn: 'root'
})
export class LiquidationExpenseDetailsService {

  private readonly http = inject(HttpClient)

  private apiUrl = enviroment.expenses_details

  get(id:number): Observable<LiquidationExpenseDetail>{
    return this.http.get<LiquidationExpenseDetail>(`${this.apiUrl}?expense_id=${id}`,)
  }
}
