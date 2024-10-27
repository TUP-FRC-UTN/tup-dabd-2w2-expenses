import {inject, Injectable } from '@angular/core';
import { Bill } from '../models/bill';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import BillType from "../models/billType";
import {BillPostRequest} from "../models/bill-post-request";
import { PORT } from '../const';
import { Page } from './expense.service';

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

  getAllBillsPaged(size: number, page:number, period: number | null, category: number | null, type: number | undefined, status:string):Observable<Page<Bill>>{
    if (type == undefined) type = 0;

    let request = `${this.url}bills?size=${size}&page=${page}&type=${type}&status=${status}`

    if (category != null) { request = request + `&category=${category}`}
    if (period != null) request = request + `&period=${period}`

    try{
      return this.http.get<Page<Bill>>(request);
     }catch( e) {
       console.log(e)
       throw  e
     }
  }

  addBill(bill: BillPostRequest): Observable<Bill> {
    return this.http.post<Bill>(this.url + 'bill', bill);
  }

  getBillTypes(): Observable<BillType[]>{
    return this.http.get<BillType[]>(this.url + 'bill-type')
  }
  updateBill(updatedBill: Bill): Observable<Bill> {
    return this.http.put<Bill>(this.url+"bill/edit/"+updatedBill.expenditure_id+"/id", updatedBill);
  }

}
