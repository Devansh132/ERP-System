import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { FilemanagerComponent } from './filemanager/filemanager.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    // This will redirect to role-based dashboard (handled in component or guard)
  },
  // Commented out for ERP implementation
  // { path: 'calendar', component: CalendarComponent },
  // { path: 'chat', component: ChatComponent },
  // { path: 'filemanager', component: FilemanagerComponent },
  // { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
  // { path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
  // { path: 'ecommerce', loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule) },
  // { path: 'crypto', loadChildren: () => import('./crypto/crypto.module').then(m => m.CryptoModule) },
  // { path: 'email', loadChildren: () => import('./email/email.module').then(m => m.EmailModule) },
  // { path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule) },
  // { path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule) },
  // { path: 'tasks', loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule) },
  // { path: 'contacts', loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule) },
  // { path: 'blog', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule) },
  // { path: 'utility', loadChildren: () => import('./utility/utility.module').then(m => m.UtilityModule) },
  // { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) },
  // { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
  // { path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule) },
  // { path: 'charts', loadChildren: () => import('./chart/chart.module').then(m => m.ChartModule) },
  // { path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule) },
  // { path: 'jobs', loadChildren: () => import('./jobs/jobs.module').then(m => m.JobsModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
