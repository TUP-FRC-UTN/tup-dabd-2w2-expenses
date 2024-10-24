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
   private apiUrl = "http://localhost:8088/expense/"
   get(): Observable<Expense[]>{
    console.log('cargando todas')
    return this.http.get<Expense[]>(`${this.apiUrl}all`)
  }
  getByPeriod(periodId:number):Observable<Expense>{
    console.log('cargando por periodos')
    return this.http.get<Expense>(`${this.apiUrl}period/${periodId}`)
  }
  getByPeriodAndPlot(periodId:number, plotId:Number):Observable<Expense[]>{
    console.log(periodId)
    return this.http.get<Expense[]>(`${this.apiUrl}periodAndPlot?periodId=${periodId}&idPlot=${plotId}`)
  }
  getExpenseCurrentPeriod():Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/currentPeriod/`)
  }
}
