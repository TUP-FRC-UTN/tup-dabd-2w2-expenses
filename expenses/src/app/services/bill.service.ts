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

  addBill(billRequest: BillPostRequest): Observable<BillPostRequest> {
    // Transformar de camelCase a snake_case antes de enviar al backend
    const transformedBill = {
      category_id: billRequest.categoryId,
      description: billRequest.description,
      amount: billRequest.amount,
      date: billRequest.date,
      status: billRequest.status,
      supplier_id: billRequest.supplierId,
      supplier_employee_type: billRequest.supplierEmployeeType,
      type_id: billRequest.typeId,
      period_id: billRequest.periodId,
      link_pdf: billRequest.linkPdf
    };

    return this.http.post<BillPostRequest>(this.url + 'bills', transformedBill);
  }

  getBillTypes(): Observable<BillType[]>{
    return this.http.get<BillType[]>(this.url + 'bill-type')
  }
  updateBill(updatedBill: Bill): Observable<Bill> {
    return this.http.put<Bill>(this.url+"bill/edit/"+updatedBill.expenditure_id+"/id", updatedBill);
  }

}
