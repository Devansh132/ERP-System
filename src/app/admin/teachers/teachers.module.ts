import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TeachersRoutingModule } from './teachers-routing.module';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './list/add-edit/add-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TeachersRoutingModule,
    ListComponent,
    AddEditComponent
  ]
})
export class TeachersModule { }

