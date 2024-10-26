import { inject, Injectable } from '@angular/core';
import Expense from '../models/expense';
import Period from '../models/period';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PORT } from '../const';

interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

@Injectable({
  providedIn: 'root',
})
export class ExpenseServiceService {

  constructor() { }
  private readonly http = inject(HttpClient)
  private apiUrl = `${PORT}expense/`
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

   get(): Observable<Expense[]>{
    console.log('cargando todas')
    return this.http.get<Expense[]>(`${this.apiUrl}all`)
  }
  getByPeriod(periodId:number):Observable<Expense[]>{
    //calcular y recuperar lista de expensas de un periodo
    return this.http.post<Expense[]>(`${this.apiUrl}create/${periodId}`,null)
  }
  getByPeriodAndPlot(periodId:number, plotId:Number):Observable<Expense[]>{
    console.log(periodId)
    return this.http.get<Expense[]>(`${this.apiUrl}periodAndPlot?periodId=${periodId}&idPlot=${plotId}`)
  }
  getExpenseCurrentPeriod():Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/currentPeriod/`)
  }
}
