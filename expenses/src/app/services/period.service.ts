
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Period from '../models/period';
import { enviroment } from '../../../enviroment';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {


  constructor() { }

  private readonly http = inject(HttpClient)

  private apiUrl = enviroment.periods;

  get(): Observable<Period[]> {

    try{
     const response = this.http.get<Period[]>(this.apiUrl)
      return response
    }catch( e) {
      console.log(e)
      throw  e
    }

  }
}
