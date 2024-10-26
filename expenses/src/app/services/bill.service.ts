import {inject, Injectable } from '@angular/core';
import { Bill } from '../models/bill';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import BillType from "../models/billType";
import {BillPostRequest} from "../models/bill-post-request";
import { PORT } from '../const';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private http = inject(HttpClient);
  private url = PORT

  constructor() { }

  getAllBills():Observable<Bill[]>{
    return this.http.get<Bill[]>(this.url + 'bill/full-list')
  }

  addBill(bill: BillPostRequest): Observable<Bill> {
    return this.http.post<Bill>(this.url + 'bill', bill);
  }

  getBillTypes(): Observable<BillType[]>{
    return this.http.get<BillType[]>(this.url + '/bill-type')
  }
  updateBill(updatedBill: Bill): Observable<Bill> {
    return this.http.put<Bill>(this.url+"bill/edit/"+updatedBill.expenditure_id+"/id", updatedBill);
  }

}
