import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassesService, CreateClassRequest } from '../../../../core/services/classes.service';
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
  selector: 'app-class-add-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PagetitleComponent],
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
  breadCrumbItems: BreadcrumbItem[];
  classForm: FormGroup;
  isEditMode = false;
  classId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private classesService: ClassesService,
    private toastr: ToastrService
  ) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Classes', link: '/admin/classes/list' },
      { label: 'Add', active: true }
    ];

    this.classForm = this.fb.group({
      name: ['', Validators.required],
      level: ['', [Validators.required, Validators.min(1)]],
      capacity: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.classId = +id;
      this.breadCrumbItems[2].label = 'Edit';
      this.loadClass();
    } else {
      this.breadCrumbItems[2].label = 'Add';
    }
  }

  loadClass(): void {
    if (!this.classId) return;

    this.loading = true;
    this.classesService.getClass(this.classId).subscribe({
      next: (cls) => {
        this.classForm.patchValue({
          name: cls.name,
          level: cls.level,
          capacity: cls.capacity
        });
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error?.error?.error || error?.error || 'Failed to load class', 'Error');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.classForm.invalid) {
      this.classForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.classForm.value;

    if (this.isEditMode && this.classId) {
      const updateData: any = {
        name: formValue.name,
        level: Number(formValue.level), // Convert to number
        capacity: formValue.capacity ? Number(formValue.capacity) : null
      };

      this.classesService.updateClass(this.classId, updateData).subscribe({
        next: () => {
          this.toastr.success('Class updated successfully', 'Success');
          this.router.navigate(['/admin/classes/list']);
        },
        error: (error) => {
          this.toastr.error(error?.error?.error || error?.error || 'Failed to update class', 'Error');
          this.loading = false;
        }
      });
    } else {
      const createData: CreateClassRequest = {
        name: formValue.name,
        level: Number(formValue.level), // Convert to number
        capacity: formValue.capacity ? Number(formValue.capacity) : undefined
      };

      this.classesService.createClass(createData).subscribe({
        next: () => {
          this.toastr.success('Class created successfully', 'Success');
          this.router.navigate(['/admin/classes/list']);
        },
        error: (error) => {
          this.toastr.error(error?.error?.error || error?.error || 'Failed to create class', 'Error');
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/classes/list']);
  }
}

