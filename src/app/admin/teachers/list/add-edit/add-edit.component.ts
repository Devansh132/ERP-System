import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeachersService, CreateTeacherRequest, UpdateTeacherRequest } from '../../../../core/services/teachers.service';
import { UsersService } from '../../../../core/services/users.service';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

interface BreadcrumbItem {
  label: string;
  link?: string;
  active?: boolean;
}

@Component({
  selector: 'app-teacher-add-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PagetitleComponent],
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
  breadCrumbItems: BreadcrumbItem[];
  teacherForm: FormGroup;
  isEditMode = false;
  teacherId: number | null = null;
  loading = false;
  error: string | null = null;
  users: any[] = []; // For user selection

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private teachersService: TeachersService,
    private usersService: UsersService,
    private toastr: ToastrService
  ) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Teachers', link: '/admin/teachers/list' },
      { label: this.isEditMode ? 'Edit' : 'Add', active: true }
    ];

    this.teacherForm = this.fb.group({
      user_id: ['', Validators.required],
      employee_id: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      gender: [''],
      address: [''],
      phone: [''],
      qualification: [''],
      experience: [0],
      subject_specialization: [''],
      status: ['active'] // Only for edit mode
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.teacherId = +id;
      this.breadCrumbItems[2].label = 'Edit';
      this.loadTeacher();
    } else {
      this.breadCrumbItems[2].label = 'Add';
    }

    this.loadUsers();
  }

  loadUsers(): void {
    // Load users with role 'teacher' for teacher creation
    this.usersService.getUsers({ role: 'teacher' }).subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        // If filtering by role fails, try loading all users
        this.usersService.getUsers().subscribe({
          next: (allUsers) => {
            this.users = allUsers;
          },
          error: (error) => {
            this.toastr.error(error?.error?.error || error?.error || 'Failed to load users.', 'Error');
            console.error(error);
          }
        });
      }
    });
  }

  loadTeacher(): void {
    if (!this.teacherId) return;

    this.loading = true;
    this.teachersService.getTeacher(this.teacherId).subscribe({
      next: (teacher) => {
        // Format date for input field (YYYY-MM-DD)
        const dateOfBirth = teacher.date_of_birth ? new Date(teacher.date_of_birth).toISOString().split('T')[0] : '';
        
        this.teacherForm.patchValue({
          user_id: teacher.user_id,
          employee_id: teacher.employee_id,
          first_name: teacher.first_name,
          last_name: teacher.last_name,
          date_of_birth: dateOfBirth,
          gender: teacher.gender,
          address: teacher.address,
          phone: teacher.phone,
          qualification: teacher.qualification,
          experience: teacher.experience || 0,
          subject_specialization: teacher.subject_specialization,
          status: teacher.status || 'active'
        });
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err?.error?.error || err?.error || 'Failed to load teacher data.', 'Error');
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.teacherForm.invalid) {
      this.teacherForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.teacherForm.value;

    let request: Observable<any>;
    if (this.isEditMode && this.teacherId) {
      const updateData: UpdateTeacherRequest = {
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        date_of_birth: formValue.date_of_birth,
        gender: formValue.gender,
        address: formValue.address,
        phone: formValue.phone,
        qualification: formValue.qualification,
        experience: Number(formValue.experience) || 0,
        subject_specialization: formValue.subject_specialization,
        status: formValue.status
      };
      request = this.teachersService.updateTeacher(this.teacherId, updateData);
    } else {
      const createData: CreateTeacherRequest = {
        user_id: Number(formValue.user_id),
        employee_id: formValue.employee_id,
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        date_of_birth: formValue.date_of_birth,
        gender: formValue.gender,
        address: formValue.address,
        phone: formValue.phone,
        qualification: formValue.qualification,
        experience: Number(formValue.experience) || 0,
        subject_specialization: formValue.subject_specialization
      };
      request = this.teachersService.createTeacher(createData);
    }

    request.subscribe({
      next: (res) => {
        this.toastr.success(
          this.isEditMode ? 'Teacher updated successfully' : 'Teacher created successfully',
          'Success'
        );
        this.loading = false;
        this.router.navigate(['/admin/teachers/list']);
      },
      error: (err) => {
        const errorMessage = err?.error?.error || err?.error?.message || err?.message || 'An unexpected error occurred.';
        this.toastr.error(errorMessage, 'Error');
        this.loading = false;
        console.error('Teacher operation error:', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/teachers/list']);
  }
}

