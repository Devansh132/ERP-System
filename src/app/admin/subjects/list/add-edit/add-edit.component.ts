import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectsService, CreateSubjectRequest, UpdateSubjectRequest } from '../../../../core/services/subjects.service';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface BreadcrumbItem {
  label: string;
  link?: string;
  active?: boolean;
}

@Component({
  selector: 'app-subject-add-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PagetitleComponent],
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
  breadCrumbItems: BreadcrumbItem[];
  subjectForm: FormGroup;
  isEditMode = false;
  subjectId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private subjectsService: SubjectsService,
    private toastr: ToastrService
  ) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Subjects', link: '/admin/subjects/list' },
      { label: 'Add', active: true }
    ];

    this.subjectForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.subjectId = +id;
      this.breadCrumbItems[2].label = 'Edit';
      this.loadSubject();
    } else {
      this.breadCrumbItems[2].label = 'Add';
    }
  }

  loadSubject(): void {
    if (!this.subjectId) return;

    this.loading = true;
    this.subjectsService.getSubject(this.subjectId).subscribe({
      next: (subject) => {
        this.subjectForm.patchValue({
          name: subject.name,
          code: subject.code
        });
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error?.error?.error || error?.error || 'Failed to load subject', 'Error');
        this.loading = false;
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.subjectForm.invalid) {
      this.subjectForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.subjectForm.value;

    let request: Observable<any>;
    if (this.isEditMode && this.subjectId) {
      const updateData: UpdateSubjectRequest = {
        name: formValue.name,
        code: formValue.code.toUpperCase() // Convert to uppercase
      };

      request = this.subjectsService.updateSubject(this.subjectId, updateData);
    } else {
      const createData: CreateSubjectRequest = {
        name: formValue.name,
        code: formValue.code.toUpperCase() // Convert to uppercase
      };

      request = this.subjectsService.createSubject(createData);
    }

    request.pipe(
      catchError((err) => {
        this.toastr.error(err?.error?.error || err?.error || 'An unexpected error occurred.', 'Error');
        this.loading = false;
        return of(null);
      })
    ).subscribe((res) => {
      if (res) {
        this.toastr.success(
          this.isEditMode ? 'Subject updated successfully' : 'Subject created successfully',
          'Success'
        );
        this.loading = false;
        this.router.navigate(['/admin/subjects/list']);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/subjects/list']);
  }
}

