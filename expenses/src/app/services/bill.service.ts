import {inject, Injectable } from '@angular/core';
import { Bill } from '../models/bill';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators'
import Period from '../models/period';
import { Provider } from '../models/provider';
import Category from '../models/category';
import BillType from "../models/billType";
import {BillPostRequest} from "../models/bill-post-request";
import {BillDto} from "../models/billDto";
import { PaginatedResponse } from '../models/paginatedResponse';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private http = inject(HttpClient);
  private url = environment.url



  constructor() { }

  

  getAllBills(size?: number, page?: number, period?: number, category?: number, supplier?: number, type?: number, provider?: string, status?: string): Observable<Bill[]> {
    let params = new HttpParams();

    // Agrega solo los parámetros que tengan valores válidos
    if (size !== undefined) {
      params = params.set('size', size.toString());
    }
    if (page !== undefined) {
      params = params.set('page', page.toString());
    }
    if (period !== undefined) {
      params = params.set('period', period.toString());
    }
    if (category !== undefined) {
      params = params.set('category', category.toString());
    }
    if (supplier !== undefined) {
      params = params.set('supplier', supplier.toString());
    }
    if (type !== undefined) {
      params = params.set('type', type.toString());
    }
    if (provider) {
      params = params.set('provider', provider);
    }
    if (status) {
      params = params.set('status', status);
    }

    // Realiza la solicitud HTTP con los parámetros construidos
    return this.formatBills(this.http.get<PaginatedResponse<BillDto>>(`${this.url}/bills`, { params }));
  }

  getAllBillsAndPagination(size?: number, page?: number, period?: number, category?: number, supplier?: number, type?: number, provider?: string, status?: string): Observable<PaginatedResponse<BillDto>>{
    let params = new HttpParams();

    // Agrega solo los parámetros que tengan valores válidos
    if (size !== undefined) {
      params = params.set('size', size.toString());
    }
    if (page !== undefined) {
      params = params.set('page', page.toString());
    }
    if (period !== undefined) {
      params = params.set('period', period.toString());
    }
    if (category !== undefined) {
      params = params.set('category', category.toString());
    }
    if (supplier !== undefined) {
      params = params.set('supplier', supplier.toString());
    }
    if (type !== undefined) {
      params = params.set('type', type.toString());
    }
    if (provider) {
      params = params.set('provider', provider);
    }
    if (status) {
      params = params.set('status', status);
    }

    // Realiza la solicitud HTTP con los parámetros construidos
    return this.http.get<PaginatedResponse<BillDto>>(`${this.url}/bills`, { params });
  }

  
  getBillTypes(): Observable<BillType[]>{
    return this.http.get<BillType[]>(`${this.url}/billType`)
  }
  
  addBill(bill: BillPostRequest): Observable<Bill> {
    return this.http.post<Bill>(`${this.url}/bills`, bill);
  }
  
  updateBill(updatedBill: Bill): Observable<Bill> {
    return this.http.put<Bill>(`${this.url}/bills/edit/${updatedBill.expenditureId}/id`, updatedBill);
    
  }

  //Metodo para formatear de billsDto con paginacion a un observable de bills
  private formatBills(billsDto$: Observable<PaginatedResponse<BillDto>>): Observable<Bill[]> {
    return billsDto$.pipe(

      map((response)=>{
        const billsDto = response.content;
        if(!Array.isArray(billsDto)){
          console.error('La respuesta del servidor no contiene una array')
          return []
        }
        return billsDto.map((billDto)=>
          new Bill(
            billDto.expenditure_id,
            billDto.date,
            billDto.amount,
            billDto.description,
            billDto.supplier,
            billDto.period,
            billDto.category,
            billDto.bill_type,
            billDto.status
          )
        )
      })
    );
  }

}
  


