import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import Category from '../models/category';
import { PORT } from '../const';
import {PaginatedResponse} from "../models/paginatedResponse";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);
  private url = `${PORT}categories`
  constructor() { }

  getPaginatedCategories(
    page: number = 0,
    size: number = 10,
    sortField: string = 'name',
    direction: 'asc' | 'desc' = 'asc'
  ): Observable<PaginatedResponse<Category>> {
    try {
      // Construimos el objeto pageable según el formato esperado por el backend
      const pageable = {
        page: page,
        size: size,
        sort: [`${sortField},${direction}`]
      };

      // Construimos los parámetros
      let params = new HttpParams()
        .set('pageable', JSON.stringify(pageable));

      // Si necesitas pasar el isDeleted como parámetro opcional
      // params = params.set('isDeleted', 'false');

      console.log('Request URL:', `${this.url}/page`);
      console.log('Request params:', params.toString());

      return this.http.get<PaginatedResponse<Category>>(`${this.url}/page`, { params });
    } catch (error) {
      console.error('Error en getPaginatedCategories:', error);
      throw error;
    }
  }

  getAllCategories():Observable<Category[]>{
    try {
      const response = this.http.get<Category[]>(this.url)
      return response
    } catch (error) {
      throw error
    }
  }

  addCategory(newCategory: Category) {
    try {
      return this.http.post<Category>(this.url, newCategory)
    } catch (error) {
      throw error
    }
  }

  updateCategory(categoryId: number, category: Partial<Category>) {
    try {
      const updateData = {
        name: category.name,
        description: category.description,
        is_delete: category.is_delete
      };
      return this.http.put<Category>(`${this.url}/${categoryId}`, updateData);
    } catch (error) {
      throw error;
    }
  }
}
