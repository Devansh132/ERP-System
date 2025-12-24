# School ERP System - Implementation Guide

## 🚀 Quick Start Implementation Steps

### Step 1: Create Role-Based Route Guards

#### Create Role Guard (`src/app/core/guards/role.guard.ts`):
```typescript
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRoles = route.data['roles'] as Array<string>;
        const currentUser = this.authService.currentUserValue;
        
        if (!currentUser) {
            this.router.navigate(['/auth/login']);
            return false;
        }

        if (expectedRoles && !expectedRoles.includes(currentUser.role)) {
            this.router.navigate(['/unauthorized']);
            return false;
        }

        return true;
    }
}
```

### Step 2: Update App Routes with Role-Based Routing

#### Update `app.routes.ts`:
```typescript
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    {
        path: "auth",
        loadChildren: () => import("./account/account.module").then((m) => m.AccountModule),
    },
    {
        path: "admin",
        component: LayoutComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['admin'] },
        loadChildren: () => import("./admin/admin.module").then((m) => m.AdminModule),
    },
    {
        path: "teacher",
        component: LayoutComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['teacher'] },
        loadChildren: () => import("./teacher/teacher.module").then((m) => m.TeacherModule),
    },
    {
        path: "student",
        component: LayoutComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['student'] },
        loadChildren: () => import("./student/student.module").then((m) => m.StudentModule),
    },
    {
        path: "",
        component: LayoutComponent,
        loadChildren: () => import("./pages/pages.module").then((m) => m.PagesModule),
        canActivate: [AuthGuard],
    },
    { path: "**", component: Page404Component },
];
```

### Step 3: Create Module Structure

#### Admin Module Structure:
```
src/app/admin/
├── admin.module.ts
├── admin-routing.module.ts
├── students/
│   ├── students.module.ts
│   ├── students-routing.module.ts
│   ├── list/
│   │   └── list.component.ts
│   └── add-edit/
│       └── add-edit.component.ts
├── teachers/
├── classes/
├── attendance/
└── ...
```

#### Create `admin/admin-routing.module.ts`:
```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: AdminDashboardComponent },
    { 
        path: 'students', 
        loadChildren: () => import('./students/students.module').then(m => m.StudentsModule) 
    },
    { 
        path: 'teachers', 
        loadChildren: () => import('./teachers/teachers.module').then(m => m.TeachersModule) 
    },
    { 
        path: 'classes', 
        loadChildren: () => import('./classes/classes.module').then(m => m.ClassesModule) 
    },
    { 
        path: 'attendance', 
        loadChildren: () => import('./attendance/attendance.module').then(m => m.AttendanceModule) 
    },
    // ... more routes
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
```

### Step 4: Create API Service Structure

#### Create `core/services/api.service.ts`:
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // Generic CRUD methods
    get<T>(endpoint: string, params?: any): Observable<T> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                httpParams = httpParams.set(key, params[key]);
            });
        }
        return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { params: httpParams });
    }

    post<T>(endpoint: string, data: any): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data);
    }

    put<T>(endpoint: string, id: string | number, data: any): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}/${endpoint}/${id}`, data);
    }

    delete<T>(endpoint: string, id: string | number): Observable<T> {
        return this.http.delete<T>(`${this.apiUrl}/${endpoint}/${id}`);
    }
}
```

#### Create Student Service (`admin/students/students.service.ts`):
```typescript
import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';

export interface Student {
    id?: number;
    admission_number: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    class_id: number;
    section_id: number;
    // ... more fields
}

@Injectable({ providedIn: 'root' })
export class StudentsService {
    constructor(private api: ApiService) { }

    getStudents(params?: any): Observable<Student[]> {
        return this.api.get<Student[]>('admin/students', params);
    }

    getStudent(id: number): Observable<Student> {
        return this.api.get<Student>(`admin/students/${id}`);
    }

    createStudent(student: Student): Observable<Student> {
        return this.api.post<Student>('admin/students', student);
    }

    updateStudent(id: number, student: Student): Observable<Student> {
        return this.api.put<Student>('admin/students', id, student);
    }

    deleteStudent(id: number): Observable<void> {
        return this.api.delete<void>('admin/students', id);
    }

    bulkImport(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.api.post<any>('admin/students/bulk-import', formData);
    }
}
```

### Step 5: Backend Go Implementation Example

#### Create `backend/internal/handlers/auth.go`:
```go
package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
)

type AuthHandler struct {
    // Add dependencies
}

func (h *AuthHandler) Login(c *gin.Context) {
    var loginReq struct {
        Email    string `json:"email" binding:"required"`
        Password string `json:"password" binding:"required"`
    }

    if err := c.ShouldBindJSON(&loginReq); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Validate user credentials
    // Generate JWT token
    // Return token and user info
}

func (h *AuthHandler) Register(c *gin.Context) {
    // Registration logic
}
```

#### Create `backend/internal/middleware/auth.go`:
```go
package middleware

import (
    "net/http"
    "strings"
    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        tokenString := c.GetHeader("Authorization")
        if tokenString == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
            c.Abort()
            return
        }

        tokenString = strings.TrimPrefix(tokenString, "Bearer ")
        
        // Validate token
        // Set user context
        c.Next()
    }
}

func RoleMiddleware(allowedRoles ...string) gin.HandlerFunc {
    return func(c *gin.Context) {
        userRole := c.GetString("user_role")
        
        for _, role := range allowedRoles {
            if userRole == role {
                c.Next()
                return
            }
        }
        
        c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
        c.Abort()
    }
}
```

#### Create `backend/internal/handlers/student.go`:
```go
package handlers

import (
    "net/http"
    "strconv"
    "github.com/gin-gonic/gin"
)

type StudentHandler struct {
    // Add service dependencies
}

func (h *StudentHandler) GetStudents(c *gin.Context) {
    // Get query parameters
    classID := c.Query("class_id")
    sectionID := c.Query("section_id")
    
    // Fetch students from database
    // Return JSON response
}

func (h *StudentHandler) CreateStudent(c *gin.Context) {
    var student struct {
        AdmissionNumber string `json:"admission_number" binding:"required"`
        FirstName       string `json:"first_name" binding:"required"`
        LastName        string `json:"last_name" binding:"required"`
        // ... more fields
    }

    if err := c.ShouldBindJSON(&student); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Create student in database
    // Return created student
}

func (h *StudentHandler) UpdateStudent(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    
    var student struct {
        // Update fields
    }

    if err := c.ShouldBindJSON(&student); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Update student in database
}

func (h *StudentHandler) DeleteStudent(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    
    // Delete student from database
    c.JSON(http.StatusOK, gin.H{"message": "Student deleted successfully"})
}
```

### Step 6: Database Models (Go)

#### Create `backend/internal/models/student.go`:
```go
package models

import "time"

type Student struct {
    ID              uint      `gorm:"primaryKey" json:"id"`
    UserID          uint      `gorm:"not null" json:"user_id"`
    AdmissionNumber string    `gorm:"unique;not null" json:"admission_number"`
    FirstName       string    `gorm:"not null" json:"first_name"`
    LastName        string    `gorm:"not null" json:"last_name"`
    DateOfBirth     time.Time `json:"date_of_birth"`
    Gender          string    `json:"gender"`
    Address         string    `json:"address"`
    Phone           string    `json:"phone"`
    ParentName      string    `json:"parent_name"`
    ParentPhone     string    `json:"parent_phone"`
    ClassID         uint      `gorm:"not null" json:"class_id"`
    SectionID       uint      `gorm:"not null" json:"section_id"`
    Status          string    `gorm:"default:active" json:"status"`
    CreatedAt       time.Time `json:"created_at"`
    UpdatedAt       time.Time `json:"updated_at"`
    
    // Relationships
    User    User    `gorm:"foreignKey:UserID" json:"user,omitempty"`
    Class   Class   `gorm:"foreignKey:ClassID" json:"class,omitempty"`
    Section Section `gorm:"foreignKey:SectionID" json:"section,omitempty"`
}
```

### Step 7: Frontend Component Example

#### Create `admin/students/list/list.component.ts`:
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentsService, Student } from '../students.service';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';

@Component({
    selector: 'app-student-list',
    standalone: true,
    imports: [CommonModule, RouterModule, PagetitleComponent],
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class StudentListComponent implements OnInit {
    students: Student[] = [];
    loading = false;
    breadCrumbItems: Array<{}>;

    constructor(private studentsService: StudentsService) {
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
        this.studentsService.getStudents().subscribe({
            next: (data) => {
                this.students = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading students:', error);
                this.loading = false;
            }
        });
    }

    deleteStudent(id: number): void {
        if (confirm('Are you sure you want to delete this student?')) {
            this.studentsService.deleteStudent(id).subscribe({
                next: () => {
                    this.loadStudents();
                },
                error: (error) => {
                    console.error('Error deleting student:', error);
                }
            });
        }
    }
}
```

### Step 8: Environment Configuration

#### Update `src/environments/environment.ts`:
```typescript
export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080/api',
    defaultauth: 'jwt',
    // ... other config
};
```

#### Update `src/environments/environment.prod.ts`:
```typescript
export const environment = {
    production: true,
    apiUrl: 'https://api.yourschool.com/api',
    defaultauth: 'jwt',
    // ... other config
};
```

### Step 9: Menu Configuration Based on Role

#### Update `layouts/sidebar/menu.ts` to include role-based menu:
```typescript
export const getMenuByRole = (role: string): MenuItem[] => {
    switch(role) {
        case 'admin':
            return ADMIN_MENU;
        case 'teacher':
            return TEACHER_MENU;
        case 'student':
            return STUDENT_MENU;
        default:
            return [];
    }
};

export const ADMIN_MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        link: '/admin/dashboard',
    },
    {
        id: 3,
        label: 'MENUITEMS.STUDENTS.TEXT',
        icon: 'bx-user',
        link: '/admin/students',
    },
    // ... more admin menu items
];

export const TEACHER_MENU: MenuItem[] = [
    // Teacher menu items
];

export const STUDENT_MENU: MenuItem[] = [
    // Student menu items
];
```

### Step 10: Database Migration Scripts

#### Create SQL migration file:
```sql
-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    admission_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    phone VARCHAR(20),
    parent_name VARCHAR(100),
    parent_phone VARCHAR(20),
    class_id INTEGER REFERENCES classes(id),
    section_id INTEGER REFERENCES sections(id),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_section_id ON students(section_id);
CREATE INDEX idx_students_user_id ON students(user_id);
```

---

## 📋 Priority Implementation Order

1. **Week 1-2**: Authentication & Role Management
2. **Week 3-4**: Admin - Student & Teacher Management
3. **Week 5-6**: Admin - Class & Section Setup
4. **Week 7-8**: Attendance Module (All Roles)
5. **Week 9-10**: Timetable & Calendar
6. **Week 11-12**: Exams & Marks
7. **Week 13-14**: Assignments
8. **Week 15-16**: Notices & Library
9. **Week 17-18**: Transport & Hostel
10. **Week 19-20**: Reports & Analytics

---

## 🔍 Testing Checklist

- [ ] Authentication flow
- [ ] Role-based access control
- [ ] CRUD operations for all entities
- [ ] File upload functionality
- [ ] Data validation
- [ ] Error handling
- [ ] Responsive design
- [ ] Performance optimization
- [ ] Security testing
- [ ] Integration testing

---

This guide provides the foundation for implementing the School ERP System. Start with Phase 1 and gradually build upon it.

