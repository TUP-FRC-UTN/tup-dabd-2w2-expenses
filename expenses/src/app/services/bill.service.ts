import {inject, Injectable } from '@angular/core';
import { Bill } from '../models/bill';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Period from '../models/period';
import { Provider } from '../models/provider';
import Category from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private http = inject(HttpClient);
  private url = "http://localhost:3000/bills"


  getAllBills():Observable<Bill[]>{
    return this.http.get<Bill[]>(this.url)
  }
  
  
  constructor() { }
}
