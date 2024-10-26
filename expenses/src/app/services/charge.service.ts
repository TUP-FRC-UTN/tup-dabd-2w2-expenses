import { Charge } from './../models/charge';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PORT } from '../const';

@Injectable({
  providedIn: 'root',
})
export class ChargeService {
  private url = 'http://localhost:3001/cargosLote';
  private http = inject(HttpClient);
  private apiUrl = `${PORT}charges`
  constructor() {}

  addCharge(charge: Charge): Observable<Charge> {
    return this.http.post<Charge>(this.apiUrl, charge);
  }

  getCharges(): Observable<Charge[]> {
    return this.http.get<Charge[]>(this.apiUrl + '/fines');
  }

  updateCharge(charge: Charge): Observable<Charge> {
    return this.http.put<Charge>(`${this.apiUrl}/${charge.charge_id}`, charge);
  }  

  deleteCharge(charge: number): Observable<Charge> {
    return this.http.delete<Charge>(this.apiUrl + '/' + charge);
  }



  
  createCharge(charge: Charge): Observable<Charge> {
    return this.http.post<Charge>(this.apiUrl, charge);
  }
}
