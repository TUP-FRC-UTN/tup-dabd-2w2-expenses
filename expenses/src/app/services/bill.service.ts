import {inject, Injectable } from '@angular/core';
import { Bill } from '../models/bill';
import { HttpClient } from '@angular/common/http';
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

  

  getAllBills(size?: number, page?: number): Observable<Bill[]> {
    let endpoint = `${this.url}/bills`;
    if (size !== undefined && page !== undefined) {
      endpoint += `?size=${size}&page=${page}`;
    } else if (size !== undefined) {
      endpoint += `?size=${size}`;
    } else if (page !== undefined) {
      endpoint += `?page=${page}`;
    }
  
    // Llama a formatBills pasando el observable de la llamada HTTP
    return this.formatBills(this.http.get<PaginatedResponse<BillDto>>(endpoint));
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
  


