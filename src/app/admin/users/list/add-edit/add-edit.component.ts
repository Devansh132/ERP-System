import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService, CreateUserRequest, UpdateUserRequest } from '../../../../core/services/users.service';
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
  selector: 'app-user-add-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PagetitleComponent],
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
  breadCrumbItems: BreadcrumbItem[];
  userForm: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  loading = false;
  error: string | null = null;
  showPassword = false;

  roles = ['admin', 'teacher', 'student'];
  statuses = ['active', 'inactive'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private toastr: ToastrService
  ) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Users', link: '/admin/users/list' },
      { label: 'Add', active: true }
    ];

    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      status: ['active']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = +id;
      this.breadCrumbItems[2].label = 'Edit';
      // Password is optional in edit mode
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      this.loadUser();
    } else {
      this.breadCrumbItems[2].label = 'Add';
    }
  }

  loadUser(): void {
    if (!this.userId) return;

    this.loading = true;
    this.usersService.getUser(this.userId).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          email: user.email,
          role: user.role,
          status: user.status || 'active',
          password: '' // Don't populate password
        });
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error?.error?.error || error?.error || 'Failed to load user', 'Error');
        this.loading = false;
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.userForm.value;

    let request: Observable<any>;
    if (this.isEditMode && this.userId) {
      const updateData: UpdateUserRequest = {
        email: formValue.email,
        role: formValue.role.toLowerCase(), // Ensure lowercase
        status: formValue.status
      };

      // Only include password if it's provided
      if (formValue.password && formValue.password.trim() !== '') {
        updateData.password = formValue.password;
      }

      request = this.usersService.updateUser(this.userId, updateData);
    } else {
      const createData: CreateUserRequest = {
        email: formValue.email,
        password: formValue.password,
        role: formValue.role.toLowerCase(), // Ensure lowercase
        status: formValue.status || 'active'
      };

      request = this.usersService.createUser(createData);
    }

    request.subscribe({
      next: (res) => {
        this.toastr.success(
          this.isEditMode ? 'User updated successfully' : 'User created successfully',
          'Success'
        );
        this.loading = false;
        this.router.navigate(['/admin/users/list']);
      },
      error: (err) => {
        const errorMessage = err?.error?.error || err?.error?.message || err?.message || 'An unexpected error occurred.';
        this.toastr.error(errorMessage, 'Error');
        this.loading = false;
        console.error('User operation error:', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/users/list']);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}

