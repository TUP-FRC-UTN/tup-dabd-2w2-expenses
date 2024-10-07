import { Charge } from './../models/charge';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChargeService {
  private url = 'http://localhost:3000/cargosLote';
  private http = inject(HttpClient);

  constructor() {}

  addCharge(charge: Charge): Observable<Charge> {
    return this.http.post<Charge>(this.url, charge);
  }

  getCharges(): Observable<Charge[]> {
    return this.http.get<Charge[]>(this.url);
  }

  updateCharge(charge: Charge): Observable<Charge> {
    return this.http.put<Charge>(`${this.url}/${charge.id}`, charge);
  }  

  deleteCharge(charge: number): Observable<Charge> {
    return this.http.delete<Charge>(this.url + '/' + charge);
  }
}
