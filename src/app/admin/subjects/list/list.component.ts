import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectsService, Subject } from '../../../core/services/subjects.service';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PagetitleComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  breadCrumbItems: Array<{ label: string; link?: string; active?: boolean }>;
  subjects: Subject[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private subjectsService: SubjectsService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Subjects', active: true }
    ];
  }

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.loading = true;
    this.error = null;

    this.subjectsService.getSubjects().subscribe({
      next: (data) => {
        this.subjects = data;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error?.error?.error || error?.error || 'Failed to load subjects', 'Error');
        this.loading = false;
        console.error('Error loading subjects:', error);
      }
    });
  }

  addSubject(): void {
    this.router.navigate(['/admin/subjects/list/add']);
  }

  editSubject(id: number): void {
    this.router.navigate(['/admin/subjects/list/edit', id]);
  }

  deleteSubject(id: number): void {
    if (confirm('Are you sure you want to delete this subject?')) {
      this.subjectsService.deleteSubject(id).subscribe({
        next: () => {
          this.toastr.success('Subject deleted successfully', 'Success');
          this.loadSubjects();
        },
        error: (error) => {
          this.toastr.error(error?.error?.error || error?.error || 'Failed to delete subject', 'Error');
          console.error('Error deleting subject:', error);
        }
      });
    }
  }
}

