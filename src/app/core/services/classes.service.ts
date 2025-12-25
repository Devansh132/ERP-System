import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Class {
  id?: number;
  name: string;
  level: number;
  capacity?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  sections?: Section[];
}

export interface Section {
  id?: number;
  class_id: number;
  name: string;
  capacity?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  class?: Class;
}

export interface CreateClassRequest {
  name: string;
  level: number;
  capacity?: number;
}

export interface UpdateClassRequest {
  name?: string;
  level?: number;
  capacity?: number;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  constructor(private api: ApiService) { }

  /**
   * Get all classes with their sections
   */
  getClasses(): Observable<Class[]> {
    return this.api.get<Class[]>('admin/classes');
  }

  /**
   * Get class by ID with sections
   * @param id Class ID
   */
  getClass(id: number): Observable<Class> {
    return this.api.get<Class>(`admin/classes/${id}`);
  }

  /**
   * Create a new class
   * @param classData Class data
   */
  createClass(classData: CreateClassRequest): Observable<Class> {
    return this.api.post<Class>('admin/classes', classData);
  }

  /**
   * Update an existing class
   * @param id Class ID
   * @param classData Updated class data
   */
  updateClass(id: number, classData: UpdateClassRequest): Observable<Class> {
    return this.api.put<Class>('admin/classes', id, classData);
  }

  /**
   * Delete a class
   * @param id Class ID
   */
  deleteClass(id: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>('admin/classes', id);
  }
}

