
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Period from '../models/period';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {


  constructor() { }

  private readonly http = inject(HttpClient)

  private apiUrl = `${environment.url}/period`;

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
}
