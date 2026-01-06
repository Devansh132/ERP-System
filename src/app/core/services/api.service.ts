import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Generic GET method
   * @param endpoint API endpoint (e.g., 'admin/students')
   * @param params Query parameters (optional)
   * @returns Observable<T>
   */
  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { params: httpParams });
  }

  /**
   * Generic POST method
   * @param endpoint API endpoint
   * @param data Request body
   * @returns Observable<T>
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  /**
   * Generic PUT method
   * @param endpoint API endpoint
   * @param id Resource ID
   * @param data Request body
   * @returns Observable<T>
   */
  put<T>(endpoint: string, id: string | number, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}/${id}`, data);
  }

  /**
   * Generic DELETE method
   * @param endpoint API endpoint
   * @param id Resource ID
   * @returns Observable<T>
   */
  delete<T>(endpoint: string, id: string | number): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}/${id}`);
  }

  /**
   * Generic PATCH method
   * @param endpoint API endpoint
   * @param id Resource ID
   * @param data Request body
   * @returns Observable<T>
   */
  patch<T>(endpoint: string, id: string | number, data: any): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${endpoint}/${id}`, data);
  }
}



