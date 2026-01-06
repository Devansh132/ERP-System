import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarkComponent } from './mark/mark.component';
import { ReportsComponent } from './reports/reports.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'mark',
    pathMatch: 'full'
  },
  {
    path: 'mark',
    component: MarkComponent
  },
  {
    path: 'reports',
    component: ReportsComponent
  },
  {
    path: 'list',
    component: ListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }

