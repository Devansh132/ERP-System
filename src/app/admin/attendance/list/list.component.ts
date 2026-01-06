import { Component, OnInit } from '@angular/core';
import { AttendanceService, Attendance } from '../../../core/services/attendance.service';
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
  selector: 'app-attendance-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PagetitleComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  breadCrumbItems: BreadcrumbItem[];
  attendances: Attendance[] = [];
  loading = false;

  constructor(
    private attendanceService: AttendanceService,
    private toastr: ToastrService
  ) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Attendance', link: '/admin/attendance/list' },
      { label: 'List', active: true }
    ];
  }

  ngOnInit(): void {
    this.loadAttendances();
  }

  loadAttendances(): void {
    this.loading = true;
    this.attendanceService.getAttendanceReports().subscribe({
      next: (attendances) => {
        this.attendances = attendances;
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err?.error?.error || err?.error || 'Failed to load attendance records.', 'Error');
        this.loading = false;
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

