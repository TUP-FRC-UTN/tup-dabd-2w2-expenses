import {inject, Injectable } from '@angular/core';
import { Bill } from '../models/bill';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Period from '../models/period';
import { Provider } from '../models/provider';
import Category from '../models/category';
import BillType from "../models/billType";
import {BillPostRequest} from "../models/bill-post-request";

@Injectable({
  providedIn: 'root'
})
export class BillService {
  
  private http = inject(HttpClient);
  private url = "http://localhost:8088"
  
  constructor() { }
  
  getAllBills():Observable<Bill[]>{
    return this.http.get<Bill[]>(this.url + '/bill/full-list')
  }
  
  addBill(bill: BillPostRequest): Observable<Bill> {
    return this.http.post<Bill>(this.url + '/bill', bill);
  }
  
  getBillTypes(): Observable<BillType[]>{
    return this.http.get<BillType[]>(this.url + '/bill-type')
  }
  updateBill(updatedBill: Bill): Observable<Bill> {
    return this.http.put<Bill>(this.url+"/bill/edit/"+updatedBill.expenditure_id+"/id", updatedBill);
  }
  
}
