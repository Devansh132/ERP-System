import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AttendanceService, MarkAttendanceRequest } from '../../../core/services/attendance.service';
import { StudentsService, Student } from '../../../core/services/students.service';
import { ClassesService, Class } from '../../../core/services/classes.service';
import { SectionsService, Section } from '../../../core/services/sections.service';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

interface BreadcrumbItem {
  label: string;
  link?: string;
  active?: boolean;
}

@Component({
  selector: 'app-attendance-mark',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PagetitleComponent],
  templateUrl: './mark.component.html',
  styleUrls: ['./mark.component.scss']
})
export class MarkComponent implements OnInit {
  breadCrumbItems: BreadcrumbItem[];
  attendanceForm: FormGroup;
  loading = false;
  students: Student[] = [];
  classes: Class[] = [];
  sections: Section[] = [];
  filteredSections: Section[] = [];
  selectedDate: string = '';
  attendanceStatus: { [studentId: number]: string } = {};

  constructor(
    private fb: FormBuilder,
    private attendanceService: AttendanceService,
    private studentsService: StudentsService,
    private classesService: ClassesService,
    private sectionsService: SectionsService,
    private toastr: ToastrService
  ) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Attendance', link: '/admin/attendance/mark' },
      { label: 'Mark Attendance', active: true }
    ];

    // Set default date to today
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];

    this.attendanceForm = this.fb.group({
      class_id: ['', Validators.required],
      section_id: ['', Validators.required],
      date: [this.selectedDate, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadClasses();
    // Don't load all sections initially - load them when class is selected

    // Watch for class changes
    this.attendanceForm.get('class_id')?.valueChanges.subscribe(classId => {
      if (classId) {
        this.loadSectionsByClass(Number(classId));
      } else {
        this.filteredSections = [];
        this.attendanceForm.get('section_id')?.setValue('');
      }
      this.students = [];
      this.attendanceStatus = {};
    });

    // Watch for section changes
    this.attendanceForm.get('section_id')?.valueChanges.subscribe(() => {
      this.loadStudents();
    });

    // Watch for date changes
    this.attendanceForm.get('date')?.valueChanges.subscribe(() => {
      if (this.attendanceForm.get('section_id')?.value) {
        this.loadExistingAttendance();
      }
    });
  }

  loadClasses(): void {
    this.classesService.getClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
      },
      error: (err) => {
        this.toastr.error(err?.error?.error || err?.error || 'Failed to load classes.', 'Error');
      }
    });
  }

  loadSectionsByClass(classId: number): void {
    if (!classId) {
      this.filteredSections = [];
      this.attendanceForm.get('section_id')?.setValue('');
      return;
    }

    // Load sections filtered by class_id from API
    this.sectionsService.getSections({ class_id: classId }).subscribe({
      next: (sections) => {
        this.filteredSections = sections;
        // Reset section selection when class changes
        this.attendanceForm.get('section_id')?.setValue('');
        // Clear students when class changes
        this.students = [];
        this.attendanceStatus = {};
      },
      error: (err) => {
        this.toastr.error(err?.error?.error || err?.error || 'Failed to load sections.', 'Error');
        this.filteredSections = [];
      }
    });
  }

  loadStudents(): void {
    const classId = this.attendanceForm.get('class_id')?.value;
    const sectionId = this.attendanceForm.get('section_id')?.value;

    if (!classId || !sectionId) {
      this.students = [];
      this.attendanceStatus = {};
      return;
    }

    this.loading = true;
    this.studentsService.getStudents({ class_id: classId, section_id: sectionId }).subscribe({
      next: (students) => {
        this.students = students;
        // Initialize all students as 'present' by default
        students.forEach(student => {
          if (student.id) {
            this.attendanceStatus[student.id] = 'present';
          }
        });
        this.loadExistingAttendance();
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err?.error?.error || err?.error || 'Failed to load students.', 'Error');
        this.loading = false;
      }
    });
  }

  loadExistingAttendance(): void {
    const classId = this.attendanceForm.get('class_id')?.value;
    const sectionId = this.attendanceForm.get('section_id')?.value;
    const date = this.attendanceForm.get('date')?.value;

    if (!classId || !sectionId || !date) {
      return;
    }

    this.attendanceService.getAttendanceByClass(classId, { section_id: sectionId, date: date }).subscribe({
      next: (attendances) => {
        // Update attendance status from existing records
        attendances.forEach(attendance => {
          if (attendance.student_id) {
            this.attendanceStatus[attendance.student_id] = attendance.status;
          }
        });
      },
      error: (err) => {
        // If no attendance found, that's okay - we'll create new records
        console.log('No existing attendance found for this date');
      }
    });
  }

  setAllStatus(status: string): void {
    this.students.forEach(student => {
      if (student.id) {
        this.attendanceStatus[student.id] = status;
      }
    });
  }

  onSubmit(): void {
    if (this.attendanceForm.invalid) {
      this.attendanceForm.markAllAsTouched();
      return;
    }

    if (this.students.length === 0) {
      this.toastr.warning('Please select a class and section with students.', 'Warning');
      return;
    }

    this.loading = true;
    const formValue = this.attendanceForm.value;

    const request: MarkAttendanceRequest = {
      class_id: Number(formValue.class_id),
      section_id: Number(formValue.section_id),
      date: formValue.date,
      attendance: this.attendanceStatus
    };

    this.attendanceService.markAttendance(request).subscribe({
      next: () => {
        this.toastr.success('Attendance marked successfully', 'Success');
        this.loading = false;
      },
      error: (err) => {
        const errorMessage = err?.error?.error || err?.error?.message || err?.message || 'An unexpected error occurred.';
        this.toastr.error(errorMessage, 'Error');
        this.loading = false;
        console.error('Attendance marking error:', err);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'present':
        return 'bg-success';
      case 'absent':
        return 'bg-danger';
      case 'late':
        return 'bg-warning';
      case 'excused':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }
}

