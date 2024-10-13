import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Provider } from '../models/provider';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  private http = inject(HttpClient);
  private url ="http://localhost:3000/providers"

  constructor() { }

  getAllProviders():Observable<Provider[]>{
    try {
      const response = this.http.get<Provider[]>(this.url);
      return response
      
    } catch (error) {
      throw error; 
    }
  }
}
