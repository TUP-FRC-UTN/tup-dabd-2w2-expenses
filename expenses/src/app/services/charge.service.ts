import { Charge } from './../models/charge';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChargeService {
  private readonly url = 'http://localhost:3000/cargosLote';
  private http = inject(HttpClient);

  constructor() {}
  
  addCharge(charge: Charge) {
    return this.http.post(this.url, charge);
  }

  getCharges():Observable<Charge[]> {
    return this.http.get<Charge[]>(this.url);
  }

  updateCharge(charge: Charge) {
    return this.http.put(`${this.url}/${charge.id}`, charge);
  }

  deleteCharge(ids: number[]) {
    return this.http.delete(`${this.url}/${ids.join(',')}`);
  }
}
