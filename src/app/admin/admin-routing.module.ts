import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
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
    path: 'sections',
    loadChildren: () => import('./sections/sections.module').then(m => m.SectionsModule)
  },
  {
    path: 'subjects',
    loadChildren: () => import('./subjects/subjects.module').then(m => m.SubjectsModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'attendance',
    loadChildren: () => import('./attendance/attendance.module').then(m => m.AttendanceModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

