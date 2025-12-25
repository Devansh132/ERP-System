import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Teacher {
  id?: number;
  user_id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender?: string;
  address?: string;
  phone?: string;
  qualification?: string;
  experience?: number;
  subject_specialization?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export interface CreateTeacherRequest {
  user_id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender?: string;
  address?: string;
  phone?: string;
  qualification?: string;
  experience?: number;
  subject_specialization?: string;
}

export interface UpdateTeacherRequest {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  phone?: string;
  qualification?: string;
  experience?: number;
  subject_specialization?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeachersService {
  constructor(private api: ApiService) { }

  /**
   * Get all teachers
   * @param params Query parameters (page, limit)
   */
  getTeachers(params?: { page?: number; limit?: number }): Observable<Teacher[]> {
    return this.api.get<Teacher[]>('admin/teachers', params);
  }

  /**
   * Get teacher by ID
   * @param id Teacher ID
   */
  getTeacher(id: number): Observable<Teacher> {
    return this.api.get<Teacher>(`admin/teachers/${id}`);
  }

  /**
   * Create a new teacher
   * @param teacher Teacher data
   */
  createTeacher(teacher: CreateTeacherRequest): Observable<Teacher> {
    return this.api.post<Teacher>('admin/teachers', teacher);
  }

  /**
   * Update an existing teacher
   * @param id Teacher ID
   * @param teacher Updated teacher data
   */
  updateTeacher(id: number, teacher: UpdateTeacherRequest): Observable<Teacher> {
    return this.api.put<Teacher>('admin/teachers', id, teacher);
  }

  /**
   * Delete a teacher
   * @param id Teacher ID
   */
  deleteTeacher(id: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>('admin/teachers', id);
  }
}

