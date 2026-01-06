import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Subject {
  id?: number;
  name: string;
  code: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSubjectRequest {
  name: string;
  code: string;
}

export interface UpdateSubjectRequest {
  name?: string;
  code?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  constructor(private api: ApiService) { }

  /**
   * Get all subjects
   */
  getSubjects(): Observable<Subject[]> {
    return this.api.get<Subject[]>('admin/subjects');
  }

  /**
   * Get subject by ID
   * @param id Subject ID
   */
  getSubject(id: number): Observable<Subject> {
    return this.api.get<Subject>(`admin/subjects/${id}`);
  }

  /**
   * Create a new subject
   * @param subject Subject data
   */
  createSubject(subject: CreateSubjectRequest): Observable<Subject> {
    return this.api.post<Subject>('admin/subjects', subject);
  }

  /**
   * Update an existing subject
   * @param id Subject ID
   * @param subject Updated subject data
   */
  updateSubject(id: number, subject: UpdateSubjectRequest): Observable<Subject> {
    return this.api.put<Subject>('admin/subjects', id, subject);
  }

  /**
   * Delete a subject
   * @param id Subject ID
   */
  deleteSubject(id: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>('admin/subjects', id);
  }
}



