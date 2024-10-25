import { CategoryCharge, Charge } from './../models/charge';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChargeService {
  private url = 'http://localhost:3001/cargosLote';
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8088/charges';
  private categoryChargeUrl = 'http://localhost:8088/category-charges';
  constructor() {}

  addCharge(charge: Charge): Observable<Charge> {
    return this.http.post<Charge>(this.apiUrl, charge);
  }

  getCharges(): Observable<Charge[]> {
    return this.http.get<Charge[]>(this.apiUrl);
  }

  updateCharge(charge: Charge): Observable<Charge> {
    return this.http.put<Charge>(`${this.url}/${charge.chargeId}`, charge);
  }  

  deleteCharge(charge: number): Observable<Charge> {
    return this.http.delete<Charge>(this.url + '/' + charge);
  }



  
  createCharge(charge: Charge): Observable<Charge> {
    return this.http.post<Charge>(this.apiUrl, charge);
  }

  getCategoryCharges(): Observable<CategoryCharge[]> {
    return this.http.get<CategoryCharge[]>(this.categoryChargeUrl);
  }


}
