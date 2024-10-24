import { inject, Injectable } from '@angular/core';
import Expense from '../models/expense';
import Period from '../models/period';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PORT } from '../const';


@Injectable({
  providedIn: 'root'
})
export class ExpenseServiceService {

  constructor() { }
  private readonly http = inject(HttpClient)
   private apiUrl = `${PORT}expense/`
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
