import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Category from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);
  private url = "http://localhost:3000/categories"
  constructor() { }

  getAllCategories():Observable<Category[]>{
    try {
      const response = this.http.get<Category[]>(this.url)
      return response
    } catch (error) {
      throw error
    }
  }
}
