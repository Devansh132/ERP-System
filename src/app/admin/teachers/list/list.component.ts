import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TeachersService, Teacher } from '../../../core/services/teachers.service';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PagetitleComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  breadCrumbItems: Array<{ label: string; link?: string; active?: boolean }>;
  teachers: Teacher[] = [];
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private teachersService: TeachersService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Teachers', active: true }
    ];
  }

  ngOnInit(): void {
    this.loadTeachers();
    
    // Reload teachers when navigating back to this page
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects || event.url;
        if (url.includes('/admin/teachers/list') && !url.includes('/add') && !url.includes('/edit')) {
          this.loadTeachers();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTeachers(): void {
    this.loading = true;
    this.error = null;

    this.teachersService.getTeachers().subscribe({
      next: (data) => {
        this.teachers = data;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error?.error?.error || error?.error || 'Failed to load teachers', 'Error');
        this.loading = false;
        console.error('Error loading teachers:', error);
      }
    });
  }

  addTeacher(): void {
    this.router.navigate(['/admin/teachers/list/add']);
  }

  editTeacher(id: number): void {
    this.router.navigate(['/admin/teachers/list/edit', id]);
  }

  deleteTeacher(id: number): void {
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.teachersService.deleteTeacher(id).subscribe({
        next: () => {
          this.toastr.success('Teacher deleted successfully', 'Success');
          this.loadTeachers();
        },
        error: (error) => {
          this.toastr.error(error?.error?.error || error?.error || 'Failed to delete teacher', 'Error');
          console.error('Error deleting teacher:', error);
        }
      });
    }
  }
}

