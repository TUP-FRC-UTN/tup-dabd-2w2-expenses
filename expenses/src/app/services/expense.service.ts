import { inject, Injectable } from '@angular/core';
import Expense from '../models/expense';
import Period from '../models/period';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseServiceService {

  constructor() { }
  private readonly http = inject(HttpClient)
   private apiUrl = "http://localhost:8081/expense/all"
   getExpenses(page: number, size: number, periodId?: number, plotId?: number, typeId?: number): Observable<Page<Expense>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (periodId) {
      console.log('periodo= '+periodId)
      params = params.set('periodId', periodId);
    }
    if (plotId) {
      console.log('lote= '+plotId)
      params = params.set('plotId', plotId);
    }
    if (typeId) {
      console.log('tipo= '+typeId)
      params = params.set('typeId', typeId);
    }

    return this.http.get<Page<Expense>>(this.apiUrl, { params });
  }

}
