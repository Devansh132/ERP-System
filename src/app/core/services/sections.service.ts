import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Section {
  id?: number;
  class_id: number;
  name: string;
  capacity?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  class?: {
    id: number;
    name: string;
    level: number;
  };
}

export interface CreateSectionRequest {
  class_id: number;
  name: string;
  capacity?: number;
}

export interface UpdateSectionRequest {
  class_id?: number;
  name?: string;
  capacity?: number;
  status?: string;
}

export interface AssignSectionRequest {
  class_id: number;
  section_id: number;
  academic_year: string;
}

export interface ClassSection {
  id?: number;
  class_id: number;
  section_id: number;
  academic_year: string;
  status?: string;
  created_at?: string;
  class?: {
    id: number;
    name: string;
  };
  section?: {
    id: number;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SectionsService {
  constructor(private api: ApiService) { }

  /**
   * Get all sections, optionally filtered by class_id
   * @param params Query parameters (class_id)
   */
  getSections(params?: { class_id?: number }): Observable<Section[]> {
    return this.api.get<Section[]>('admin/sections', params);
  }

  /**
   * Get section by ID
   * @param id Section ID
   */
  getSection(id: number): Observable<Section> {
    return this.api.get<Section>(`admin/sections/${id}`);
  }

  /**
   * Create a new section
   * @param section Section data
   */
  createSection(section: CreateSectionRequest): Observable<Section> {
    return this.api.post<Section>('admin/sections', section);
  }

  /**
   * Update an existing section
   * @param id Section ID
   * @param section Updated section data
   */
  updateSection(id: number, section: UpdateSectionRequest): Observable<Section> {
    return this.api.put<Section>('admin/sections', id, section);
  }

  /**
   * Delete a section
   * @param id Section ID
   */
  deleteSection(id: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>('admin/sections', id);
  }

  /**
   * Assign section to class for academic year
   * @param assignment Assignment data
   */
  assignSectionToClass(assignment: AssignSectionRequest): Observable<ClassSection> {
    return this.api.post<ClassSection>('admin/sections/assign', assignment);
  }
}

