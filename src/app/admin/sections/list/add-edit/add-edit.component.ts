import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionsService, CreateSectionRequest } from '../../../../core/services/sections.service';
import { ClassesService } from '../../../../core/services/classes.service';
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
  selector: 'app-section-add-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PagetitleComponent],
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
  breadCrumbItems: BreadcrumbItem[];
  sectionForm: FormGroup;
  isEditMode = false;
  sectionId: number | null = null;
  loading = false;
  error: string | null = null;
  classes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private sectionsService: SectionsService,
    private classesService: ClassesService,
    private toastr: ToastrService
  ) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Sections', link: '/admin/sections/list' },
      { label: 'Add', active: true }
    ];

    this.sectionForm = this.fb.group({
      class_id: ['', Validators.required],
      name: ['', Validators.required],
      capacity: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.sectionId = +id;
      this.breadCrumbItems[2].label = 'Edit';
      this.loadSection();
    } else {
      this.breadCrumbItems[2].label = 'Add';
    }

    this.loadClasses();
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

  loadSection(): void {
    if (!this.sectionId) return;

    this.loading = true;
      this.sectionsService.getSection(this.sectionId).subscribe({
      next: (section) => {
        this.sectionForm.patchValue({
          class_id: section.class_id,
          name: section.name,
          capacity: section.capacity
        });
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error?.error?.error || error?.error || 'Failed to load section', 'Error');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.sectionForm.invalid) {
      this.sectionForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.sectionForm.value;

    if (this.isEditMode && this.sectionId) {
      const updateData: any = {
        class_id: Number(formValue.class_id), // Convert to number
        name: formValue.name,
        capacity: formValue.capacity ? Number(formValue.capacity) : null
      };

      this.sectionsService.updateSection(this.sectionId, updateData).subscribe({
        next: () => {
          this.toastr.success('Section updated successfully', 'Success');
          this.router.navigate(['/admin/sections/list']);
        },
        error: (error) => {
          this.toastr.error(error?.error?.error || error?.error || 'Failed to update section', 'Error');
          this.loading = false;
        }
      });
    } else {
      const createData: CreateSectionRequest = {
        class_id: Number(formValue.class_id), // Convert to number
        name: formValue.name,
        capacity: formValue.capacity ? Number(formValue.capacity) : undefined
      };

      this.sectionsService.createSection(createData).subscribe({
        next: () => {
          this.toastr.success('Section created successfully', 'Success');
          this.router.navigate(['/admin/sections/list']);
        },
        error: (error) => {
          this.toastr.error(error?.error?.error || error?.error || 'Failed to create section', 'Error');
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/sections/list']);
  }
}

