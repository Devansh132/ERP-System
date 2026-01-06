import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherRoutingModule } from './teacher-routing.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TeacherRoutingModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class TeacherModule { }



