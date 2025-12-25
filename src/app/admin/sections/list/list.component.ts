import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SectionsService, Section } from '../../../core/services/sections.service';
import { ClassesService } from '../../../core/services/classes.service';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-section-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PagetitleComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  sections: Section[] = [];
  classes: any[] = [];
  selectedClassId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private sectionsService: SectionsService,
    private classesService: ClassesService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Sections', active: true }
    ];
  }

  ngOnInit(): void {
    this.loadClasses();
    this.loadSections();
  }

  loadClasses(): void {
    this.classesService.getClasses().subscribe({
      next: (data) => {
        this.classes = data;
      },
      error: (error) => {
        console.error('Error loading classes:', error);
      }
    });
  }

  loadSections(): void {
    this.loading = true;
    this.error = null;

    // Only include class_id in params if it's a valid number (not null, undefined, 0, or empty)
    const params: any = {};
    if (this.selectedClassId && this.selectedClassId !== null && this.selectedClassId !== 0) {
      params.class_id = this.selectedClassId;
    }

    // Only pass params if it has at least one property
    const finalParams = Object.keys(params).length > 0 ? params : undefined;

    this.sectionsService.getSections(finalParams).subscribe({
      next: (data) => {
        this.sections = data;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error?.error?.error || error?.error || 'Failed to load sections', 'Error');
        this.loading = false;
        console.error('Error loading sections:', error);
      }
    });
  }

  onClassFilterChange(): void {
    this.loadSections();
  }

  addSection(): void {
    this.router.navigate(['/admin/sections/list/add']);
  }

  editSection(id: number): void {
    this.router.navigate(['/admin/sections/list/edit', id]);
  }

  deleteSection(id: number): void {
    if (confirm('Are you sure you want to delete this section?')) {
      this.sectionsService.deleteSection(id).subscribe({
        next: () => {
          this.toastr.success('Section deleted successfully', 'Success');
          this.loadSections();
        },
        error: (error) => {
          this.toastr.error(error?.error?.error || error?.error || 'Failed to delete section', 'Error');
          console.error('Error deleting section:', error);
        }
      });
    }
  }
}

