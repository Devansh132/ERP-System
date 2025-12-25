import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgApexchartsModule,
    DashboardComponent // Import standalone component
  ]
})
export class DashboardModule { }

