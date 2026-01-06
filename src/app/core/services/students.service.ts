import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Student {
  id?: number;
  user_id: number;
  admission_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender?: string;
  address?: string;
  phone?: string;
  parent_name?: string;
  parent_phone?: string;
  class_id: number;
  section_id: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: number;
    email: string;
    role: string;
  };
  class?: {
    id: number;
    name: string;
    level: number;
  };
  section?: {
    id: number;
    name: string;
  };
}

export interface CreateStudentRequest {
  user_id: number;
  admission_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender?: string;
  address?: string;
  phone?: string;
  parent_name?: string;
  parent_phone?: string;
  class_id: number;
  section_id: number;
}

export interface UpdateStudentRequest {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  phone?: string;
  parent_name?: string;
  parent_phone?: string;
  class_id?: number;
  section_id?: number;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  constructor(private api: ApiService) { }

  /**
   * Get all students with optional filters
   * @param params Query parameters (class_id, section_id, page, limit)
   */
  getStudents(params?: { class_id?: number; section_id?: number; page?: number; limit?: number }): Observable<Student[]> {
    return this.api.get<Student[]>('admin/students', params);
  }

  /**
   * Get student by ID
   * @param id Student ID
   */
  getStudent(id: number): Observable<Student> {
    return this.api.get<Student>(`admin/students/${id}`);
  }

  /**
   * Create a new student
   * @param student Student data
   */
  createStudent(student: CreateStudentRequest): Observable<Student> {
    return this.api.post<Student>('admin/students', student);
  }

  /**
   * Update an existing student
   * @param id Student ID
   * @param student Updated student data
   */
  updateStudent(id: number, student: UpdateStudentRequest): Observable<Student> {
    return this.api.put<Student>('admin/students', id, student);
  }

  /**
   * Delete a student
   * @param id Student ID
   */
  deleteStudent(id: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>('admin/students', id);
  }
}



