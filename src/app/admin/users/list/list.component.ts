import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UsersService, User } from '../../../core/services/users.service';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PagetitleComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  breadCrumbItems: Array<{ label: string; link?: string; active?: boolean }>;
  users: User[] = [];
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  // Filters
  selectedRole: string | null = null;
  selectedStatus: string | null = null;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Users', active: true }
    ];
  }

  ngOnInit(): void {
    this.loadUsers();
    
    // Reload users when navigating back to this page
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        // Reload if navigating to users list (check both url and urlAfterRedirects)
        const url = event.urlAfterRedirects || event.url;
        console.log('Navigation event:', url); // Debug log
        if (url.includes('/admin/users/list') && !url.includes('/add') && !url.includes('/edit')) {
          console.log('Reloading users list...'); // Debug log
          this.loadUsers();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    console.log('Loading users...'); // Debug log
    this.loading = true;
    this.error = null;

    const params: any = {};
    if (this.selectedRole && this.selectedRole !== null && this.selectedRole !== '') {
      params.role = this.selectedRole;
    }
    if (this.selectedStatus && this.selectedStatus !== null && this.selectedStatus !== '') {
      params.status = this.selectedStatus;
    }

    const finalParams = Object.keys(params).length > 0 ? params : undefined;
    console.log('Calling getUsers with params:', finalParams); // Debug log

    this.usersService.getUsers(finalParams).subscribe({
      next: (data) => {
        console.log('Users loaded:', data); // Debug log
        this.users = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error); // Debug log
        this.toastr.error(error?.error?.error || error?.error || 'Failed to load users', 'Error');
        this.loading = false;
      }
    });
  }

  addUser(): void {
    this.router.navigate(['/admin/users/list/add']);
  }

  editUser(id: number): void {
    this.router.navigate(['/admin/users/list/edit', id]);
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.usersService.deleteUser(id).subscribe({
        next: () => {
          this.toastr.success('User deleted successfully', 'Success');
          this.loadUsers();
        },
        error: (error) => {
          this.toastr.error(error?.error?.error || error?.error || 'Failed to delete user', 'Error');
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  onFilterChange(): void {
    this.loadUsers();
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'admin':
        return 'bg-danger';
      case 'teacher':
        return 'bg-info';
      case 'student':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }
}

