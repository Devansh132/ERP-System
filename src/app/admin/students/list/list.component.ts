import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentsService, Student } from '../../../core/services/students.service';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PagetitleComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  students: Student[] = [];
  loading = false;
  error: string | null = null;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  // Filters
  selectedClassId: number | null = null;
  selectedSectionId: number | null = null;

  constructor(
    private studentsService: StudentsService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Students', active: true }
    ];
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.error = null;

    const params: any = {
      page: this.currentPage,
      limit: this.itemsPerPage
    };

    // Only include filters if they have valid values (not null, undefined, 0, or empty)
    if (this.selectedClassId && this.selectedClassId !== null && this.selectedClassId !== 0) {
      params.class_id = this.selectedClassId;
    }
    if (this.selectedSectionId && this.selectedSectionId !== null && this.selectedSectionId !== 0) {
      params.section_id = this.selectedSectionId;
    }

    this.studentsService.getStudents(params).subscribe({
      next: (data) => {
        this.students = data;
        this.totalItems = data.length; // Backend should return total count
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error?.error?.error || error?.error || 'Failed to load students', 'Error');
        this.loading = false;
        console.error('Error loading students:', error);
      }
    });
  }

  addStudent(): void {
    this.router.navigate(['/admin/students/add']);
  }

  editStudent(id: number): void {
    this.router.navigate(['/admin/students/edit', id]);
  }

  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentsService.deleteStudent(id).subscribe({
        next: () => {
          this.toastr.success('Student deleted successfully', 'Success');
          this.loadStudents();
        },
        error: (error) => {
          this.toastr.error(error?.error?.error || error?.error || 'Failed to delete student', 'Error');
          console.error('Error deleting student:', error);
        }
      });
    }
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadStudents();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadStudents();
  }
}

