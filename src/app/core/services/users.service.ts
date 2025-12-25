import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface User {
  id?: number;
  email: string;
  role: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: string;
  status?: string;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  role?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private api: ApiService) { }

  /**
   * Get all users with optional filters
   * @param params Query parameters (role, status)
   */
  getUsers(params?: { role?: string; status?: string }): Observable<User[]> {
    return this.api.get<User[]>('admin/users', params);
  }

  /**
   * Get user by ID
   * @param id User ID
   */
  getUser(id: number): Observable<User> {
    return this.api.get<User>(`admin/users/${id}`);
  }

  /**
   * Create a new user
   * @param user User data
   */
  createUser(user: CreateUserRequest): Observable<User> {
    return this.api.post<User>('admin/users', user);
  }

  /**
   * Update an existing user
   * @param id User ID
   * @param user Updated user data
   */
  updateUser(id: number, user: UpdateUserRequest): Observable<User> {
    return this.api.put<User>('admin/users', id, user);
  }

  /**
   * Delete a user
   * @param id User ID
   */
  deleteUser(id: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>('admin/users', id);
  }
}

