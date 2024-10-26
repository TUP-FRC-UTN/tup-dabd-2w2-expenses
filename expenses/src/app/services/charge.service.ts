import { CategoryCharge, Charge } from './../models/charge';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

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

  getChargesAll(): Observable<Charge[]> {
    return this.http.get<Charge[]>(this.apiUrl);
  }

  getCharges(page: number, size: number, periodId?: number, plotId?: number, typeId?: number): Observable<Page<Charge>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (periodId) {
      console.log('periodo= '+periodId)
      params = params.set('periodId', periodId);
    }
    // if (plotId) {
    //   console.log('lote= '+plotId)
    //   params = params.set('plotId', plotId);
    // }
    if (typeId) {
      console.log('tipo= '+typeId)
      params = params.set('category_charge', typeId);
    }
    return this.http.get<Page<Charge>>(this.apiUrl, { params });
  }

  updateCharge(charge: Charge): Observable<Charge> {
    return this.http.put<Charge>(`${this.url}/${charge.chargeId}`, charge);
  }  

  deleteCharge(charge: number): Observable<Boolean> {
    return this.http.delete<Boolean>(this.apiUrl + '/' + charge);
  }



  
  createCharge(charge: Charge): Observable<Charge> {
    return this.http.post<Charge>(this.apiUrl, charge);
  }

  getCategoryCharges(): Observable<CategoryCharge[]> {
    return this.http.get<CategoryCharge[]>(this.categoryChargeUrl);
  }


}
