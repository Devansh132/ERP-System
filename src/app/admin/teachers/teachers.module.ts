import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TeachersRoutingModule } from './teachers-routing.module';
import { ListComponent } from './list/list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TeachersRoutingModule,
    ListComponent
  ]
})
export class TeachersModule { }

