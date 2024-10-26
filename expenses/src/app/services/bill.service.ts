import {inject, Injectable } from '@angular/core';
import { Bill } from '../models/bill';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
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

  getAllBillsPaged(size: number, page:number, period: number, category: number, type: number, status:string):Observable<Bill[]>{
    try{
      return this.http.get<{ content: Bill[] }>(`${this.url}bill/page?size=${size}&page=${page}&period=${period}&category=${category}&type=${type}&status=${status}`).pipe(
        map(response => response.content)
      );
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
