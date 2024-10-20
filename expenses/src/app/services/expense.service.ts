import { inject, Injectable } from '@angular/core';
import Expense from '../models/expense';
import Period from '../models/period';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ExpenseServiceService {

  constructor() { }
  private readonly http = inject(HttpClient)
   private apiUrl = "http://localhost:8081/expense/"
   getExpenses(page: number, size: number, periodId?: number, plotId?: number, typeId?: number): Observable<Expense[]> {
    this.apiUrl = this.apiUrl + "all"
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (periodId) {
      params = params.set('periodId', periodId);
    }
    if (plotId) {
      params = params.set('plotId', plotId);
    }
    if (typeId) {
      params = params.set('typeId', typeId);
    }

    return this.http.get<Expense[]>(this.apiUrl, { params });
  }

}
