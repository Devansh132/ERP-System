import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentRoutingModule } from './student-routing.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StudentRoutingModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class StudentModule { }

