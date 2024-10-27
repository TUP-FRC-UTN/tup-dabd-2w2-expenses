
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import Period from '../models/period';
import { PORT } from '../const';
import { Page } from './expense.service';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {


  constructor() { }

  private readonly http = inject(HttpClient)

  private apiUrl = `${PORT}period`;

  get(): Observable<Period[]> {

    try{
     const response = this.http.get<Period[]>(this.apiUrl)
      return response
    }catch( e) {
      console.log(e)
      throw  e
    }

  }
  getOpens():Observable<Period>{
    try{4
      const response = this.http.get<Period>(`${this.apiUrl}/open`)
       return response
     }catch( e) {
       console.log(e)
       throw  e
     }
  }

  getPage(size: number, page:number,state:string|null,month:number|null, year:number|null):Observable<Page<Period>>{
    let params = new HttpParams()
    .set('size', size.toString())
    .set('page', page.toString());

  if (state) {
    params = params.set('state', state);
  }
  if(month){
    params=params.set('month',month)
  }
  if(year){
    params=params.set('year',year)
  }
  console.log(params)
  try{
      return this.http.get<Page<Period>>(`${this.apiUrl}/page`, { params });
     }catch( e) {
       console.log(e)
       throw  e
     }

  }

  new():Observable<void>{
      return this.http.post<void>(this.apiUrl, null)

  }

  closePeriod(id:number):Observable<void>{
    return this.http.put<void>(`${this.apiUrl}/close/${id}`,null)
  }
}
