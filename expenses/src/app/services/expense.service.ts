import { inject, Injectable } from '@angular/core';
import Expense from '../models/expense';
import Period from '../models/period';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ExpenseServiceService {

  constructor() { }
  private readonly http = inject(HttpClient)
   private apiUrl = "http://localhost:8081/expense/"
   get(): Observable<Expense[]>{
    console.log('cargando todas')
    return this.http.get<Expense[]>(`${this.apiUrl}all`)
  }
  getByPeriod(period:Period):Observable<Expense>{
    console.log('cargando por periodos')
    return this.http.get<Expense>(`${this.apiUrl}period/${period}`)
  }
  getByPeriodAndPlot(period:Period, plotId:Number):Observable<Expense>{
    return this.http.get<Expense>(`${this.apiUrl}periodoAndPlot/${period}${plotId}`)
  }
  getExpenseCurrentPeriod():Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/currentPeriod/`)
  }
}
