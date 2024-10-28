import {inject, Injectable } from '@angular/core';
import { Bill } from '../models/bill';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators'
import Period from '../models/period';
import { Provider } from '../models/provider';
import Category from '../models/category';
import {inject, Injectable} from '@angular/core';
import {Bill} from '../models/bill';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import BillType from "../models/billType";
import {BillPostRequest} from "../models/bill-post-request";
import {BillDto} from "../models/billDto";
import { PaginatedResponse } from '../models/paginatedResponse';
import { environment } from '../../environments/environment';
import {PORT} from '../const';
import {Page} from './expense.service';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private http = inject(HttpClient);
  private url = PORT

  constructor() { }



  getAllBills(size?: number, page?: number, period?: number, category?: number, supplier?: number, type?: number, provider?: string, status?: string): Observable<Bill[]> {
    let params = new HttpParams();

    // Agrega solo los parámetros que tengan valores válidos
    if (size !== undefined && size > 0) {
      params = params.set('size', size.toString());
    }
    if (page !== undefined && page > 0) {
      params = params.set('page', page.toString());
    }
    if (period !== undefined && period > 0) {
      params = params.set('period', period.toString());
    }
    if (category !== undefined && category > 0) {
      params = params.set('category', category.toString());
    }
    if (supplier !== undefined && supplier > 0) {
      params = params.set('supplier', supplier.toString());
    }
    if (type !== undefined && type > 0) {
      params = params.set('type', type.toString());
    }
    if (provider) {
      params = params.set('provider', provider);
    }
    if (status) {
      params = params.set('status', status);
    }

    // Realiza la solicitud HTTP con los parámetros construidos
    let result= this.formatBills(this.http.get<PaginatedResponse<BillDto>>(`${this.url}/bills`, { params }));
    result.subscribe({
      next: (data) => {
        console.log('Response data:',data)
      },
      error: (error) => {
        console.error('Error:',error)
      }
    })

    return result;
  }

  getAllBillsAndPagination(size?: number, page?: number, period?: number, category?: number, supplier?: number, type?: number, provider?: string, status?: string): Observable<PaginatedResponse<BillDto>>{
    let params = new HttpParams();

    // Agrega solo los parámetros que tengan valores válidos
    if (size !== undefined && size > 0) {
      params = params.set('size', size.toString());
    }
    if (page !== undefined && page > 0) {
      params = params.set('page', page.toString());
    }
    if (period !== undefined  && period > 0) {
      params = params.set('period', period.toString());
    }
    if (category !== undefined && category > 0) {
      params = params.set('category', category.toString());
    }
    if (supplier !== undefined && supplier > 0) {
      params = params.set('supplier', supplier.toString());
    }
    if (type !== undefined && type > 0) {
      params = params.set('type', type.toString());
    }
    if (provider) {
      params = params.set('provider', provider);
    }
    if (status) {
      params = params.set('status', status);
    }
    console.log(`${this.url}/bills`, { params })
    // Realiza la solicitud HTTP con los parámetros construidos
    let result= this.http.get<PaginatedResponse<BillDto>>(`${this.url}/bills`, { params });
    result.subscribe({
      next: (data) => {
        console.log('Response data:',data)
        console.log('Response Content:',data.content)
      },
      error: (error) => {
        console.error('Error:',error)
      }
    })
    return result;
  }


  getBillTypes(): Observable<BillType[]>{
    return this.http.get<BillType[]>(`${this.url}/bill-type`)
  }

  getAllBillsPaged(size: number, page:number, period: number | null, category: number | null, type: number, status:string):Observable<PaginatedResponse<Bill>>{
    let request = `${this.url}bills?size=${size}&page=${page}&type=${type}&status=${status}`

    if (category != null) {
      request = request + `&category=${category}`
    }
    if (period != null) request = request + `&period=${period}`

    try{
      return this.http.get<PaginatedResponse<Bill>>(request);
     }catch( e) {
       console.log(e)
       throw  e
     }
  }

  addBill(bill: BillPostRequest): Observable<Bill> {
    return this.http.post<Bill>(`${this.url}/bills`, bill);
  }

  updateBill(updatedBill: any): Observable<Bill> {
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
