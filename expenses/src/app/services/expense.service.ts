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
   private apiUrl = "http://localhost:8088/expense/all"
   getExpenses(page: number, size: number, periodId?: number, plotId?: number, typeId?: number, sortField?: string, sortOrder?: string): Observable<Page<Expense>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    // Parámetros adicionales
    if (periodId) {
      params = params.set('periodId', periodId.toString());
    }
    if (plotId) {
      params = params.set('plotId', plotId.toString());
     
    }
    if (typeId) {
      params = params.set('typeId', typeId.toString());
    }
  
    if (sortField) {
      params = params.set('sort', `${sortField},${sortOrder}`);
    }
    return this.http.get<Page<Expense>>(this.apiUrl, { params });
  }

}
