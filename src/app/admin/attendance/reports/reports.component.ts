import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AttendanceService, AttendanceStatistics } from '../../../core/services/attendance.service';
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
  selector: 'app-attendance-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PagetitleComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  breadCrumbItems: BreadcrumbItem[];
  reportForm: FormGroup;
  loading = false;
  statistics: AttendanceStatistics | null = null;
  classes: Class[] = [];
  filteredSections: Section[] = [];

  constructor(
    private fb: FormBuilder,
    private attendanceService: AttendanceService,
    private classesService: ClassesService,
    private sectionsService: SectionsService,
    private toastr: ToastrService
  ) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Attendance', link: '/admin/attendance/reports' },
      { label: 'Reports', active: true }
    ];

    // Set default dates to current month
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    this.reportForm = this.fb.group({
      class_id: [''],
      section_id: [''],
      start_date: [startDate.toISOString().split('T')[0]],
      end_date: [endDate.toISOString().split('T')[0]]
    });
  }

  ngOnInit(): void {
    this.loadClasses();
    // Don't load all sections initially - load them when class is selected

    this.reportForm.get('class_id')?.valueChanges.subscribe(classId => {
      if (classId) {
        this.loadSectionsByClass(Number(classId));
      } else {
        this.filteredSections = [];
        this.reportForm.get('section_id')?.setValue('');
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
      this.reportForm.get('section_id')?.setValue('');
      return;
    }

    // Load sections filtered by class_id from API
    this.sectionsService.getSections({ class_id: classId }).subscribe({
      next: (sections) => {
        this.filteredSections = sections;
        // Reset section selection when class changes
        this.reportForm.get('section_id')?.setValue('');
      },
      error: (err) => {
        this.toastr.error(err?.error?.error || err?.error || 'Failed to load sections.', 'Error');
        this.filteredSections = [];
      }
    });
  }

  generateReport(): void {
    this.loading = true;
    this.statistics = null;

    const formValue = this.reportForm.value;
    const params: any = {};

    if (formValue.class_id) {
      params.class_id = Number(formValue.class_id);
    }
    if (formValue.section_id) {
      params.section_id = Number(formValue.section_id);
    }
    if (formValue.start_date) {
      params.start_date = formValue.start_date;
    }
    if (formValue.end_date) {
      params.end_date = formValue.end_date;
    }

    this.attendanceService.getAttendanceStatistics(params).subscribe({
      next: (stats) => {
        this.statistics = stats;
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err?.error?.error || err?.error || 'Failed to generate report.', 'Error');
        this.loading = false;
      }
    });
  }
}

