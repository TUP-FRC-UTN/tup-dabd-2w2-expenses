import {inject, Injectable } from '@angular/core';
import { Bill } from '../models/bill';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Period from '../models/period';
import { Provider } from '../models/provider';
import Category from '../models/category';
import BillType from "../models/billType";
import {BillPostRequest} from "../models/bill-post-request";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private http = inject(HttpClient);
  private url = "http://localhost:8081"

  constructor() { }

  getAllBills(): Observable<Bill[]> {
    return this.http.get<any>(this.url + '/bills/full-list?page=0&size=5').pipe(
      map(response => response.content.map((bill: any) => ({
        expenditure_id: bill.expenditure_id,
        date: bill.date, // Asegúrate de convertir la fecha
        amount: bill.amount,
        description: bill.description,
        supplier: bill.supplier.name, // Puedes incluir más detalles si es necesario
        period: bill.period, // Igual aquí
        category: bill.category.name, // Igual aquí
        bill_type: bill.bill_type.name, // Igual aquí
        status: bill.status
      })))
    );
  }


  addBill(bill: BillPostRequest): Observable<Bill> {
    return this.http.post<Bill>(this.url + '/bill', bill);
  }

  getBillTypes(): Observable<BillType[]>{
    return this.http.get<BillType[]>(this.url + '/billType')
  }
  updateBill(updatedBill: Bill): Observable<Bill> {
    return this.http.put<Bill>(this.url+"/bill/edit/"+updatedBill.expenditure_id+"/id", updatedBill);
  }

}
