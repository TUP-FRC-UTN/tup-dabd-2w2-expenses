
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import Period from '../models/period';
import { PORT } from '../const';

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
  getOpens():Observable<Period[]>{
    try{4
      const response = this.http.get<Period[]>(`${this.apiUrl}/open`)
       return response
     }catch( e) {
       console.log(e)
       throw  e
     }
  }

  getPage(size: number, page:number):Observable<Period[]>{

    try{
      return this.http.get<{ content: Period[] }>(`${this.apiUrl}/page?size=${size}&page=${page}`).pipe(
        map(response => response.content)
      );
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
