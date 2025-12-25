import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassesService, Class } from '../../../core/services/classes.service';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PagetitleComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  classes: Class[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private classesService: ClassesService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Classes', active: true }
    ];
  }

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.loading = true;
    this.error = null;

    this.classesService.getClasses().subscribe({
      next: (data) => {
        this.classes = data;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error?.error?.error || error?.error || 'Failed to load classes', 'Error');
        this.loading = false;
        console.error('Error loading classes:', error);
      }
    });
  }

  addClass(): void {
    this.router.navigate(['/admin/classes/list/add']);
  }

  editClass(id: number): void {
    this.router.navigate(['/admin/classes/list/edit', id]);
  }

  deleteClass(id: number): void {
    if (confirm('Are you sure you want to delete this class?')) {
      this.classesService.deleteClass(id).subscribe({
        next: () => {
          this.toastr.success('Class deleted successfully', 'Success');
          this.loadClasses();
        },
        error: (error) => {
          this.toastr.error(error?.error?.error || error?.error || 'Failed to delete class', 'Error');
          console.error('Error deleting class:', error);
        }
      });
    }
  }
}

