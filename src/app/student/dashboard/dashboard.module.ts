import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    DashboardComponent,
    PagetitleComponent
  ]
})
export class DashboardModule { }

