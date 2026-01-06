import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Attendance {
  id?: number;
  student_id: number;
  class_id: number;
  section_id: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  marked_by?: number;
  created_at?: string;
  updated_at?: string;
  student?: {
    id: number;
    first_name: string;
    last_name: string;
    admission_number: string;
    user?: {
      id: number;
      email: string;
    };
  };
  class?: {
    id: number;
    name: string;
  };
  section?: {
    id: number;
    name: string;
  };
}

export interface MarkAttendanceRequest {
  class_id: number;
  section_id: number;
  date: string;
  attendance: { [studentId: number]: string }; // student_id -> status
}

export interface AttendanceStatistics {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  constructor(private api: ApiService) { }

  /**
   * Mark attendance for a class/section
   * @param data Attendance data
   */
  markAttendance(data: MarkAttendanceRequest): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('admin/attendance/mark', data);
  }

  /**
   * Get attendance by class
   * @param classId Class ID
   * @param params Optional filters (section_id, date)
   */
  getAttendanceByClass(classId: number, params?: { section_id?: number; date?: string }): Observable<Attendance[]> {
    return this.api.get<Attendance[]>(`admin/attendance/class/${classId}`, params);
  }

  /**
   * Get attendance by student
   * @param studentId Student ID
   * @param params Optional filters (start_date, end_date)
   */
  getAttendanceByStudent(studentId: number, params?: { start_date?: string; end_date?: string }): Observable<Attendance[]> {
    return this.api.get<Attendance[]>(`admin/attendance/student/${studentId}`, params);
  }

  /**
   * Get attendance statistics
   * @param params Query parameters (student_id, class_id, section_id, start_date, end_date)
   */
  getAttendanceStatistics(params?: {
    student_id?: number;
    class_id?: number;
    section_id?: number;
    start_date?: string;
    end_date?: string;
  }): Observable<AttendanceStatistics> {
    return this.api.get<AttendanceStatistics>('admin/attendance/statistics', params);
  }

  /**
   * Get attendance reports
   * @param params Query parameters (class_id, section_id, start_date, end_date)
   */
  getAttendanceReports(params?: {
    class_id?: number;
    section_id?: number;
    start_date?: string;
    end_date?: string;
  }): Observable<Attendance[]> {
    return this.api.get<Attendance[]>('admin/attendance/reports', params);
  }

  /**
   * Update attendance record
   * @param id Attendance ID
   * @param data Update data (status)
   */
  updateAttendance(id: number, data: { status: string }): Observable<Attendance> {
    return this.api.put<Attendance>('admin/attendance', id, data);
  }
}

