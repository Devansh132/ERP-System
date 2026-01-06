import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsService } from '../../core/services/students.service';
import { TeachersService } from '../../core/services/teachers.service';
import { ClassesService } from '../../core/services/classes.service';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, PagetitleComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  
  stats = {
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalSections: 0
  };
  
  loading = false;

  constructor(
    private studentsService: StudentsService,
    private teachersService: TeachersService,
    private classesService: ClassesService
  ) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Dashboard', active: true }
    ];
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Load all stats in parallel
    Promise.all([
      this.studentsService.getStudents().toPromise(),
      this.teachersService.getTeachers().toPromise(),
      this.classesService.getClasses().toPromise()
    ]).then(([students, teachers, classes]) => {
      this.stats.totalStudents = students?.length || 0;
      this.stats.totalTeachers = teachers?.length || 0;
      this.stats.totalClasses = classes?.length || 0;
      
      // Calculate total sections
      let totalSections = 0;
      classes?.forEach((cls: any) => {
        totalSections += cls.sections?.length || 0;
      });
      this.stats.totalSections = totalSections;
      
      this.loading = false;
    }).catch(error => {
      console.error('Error loading dashboard data:', error);
      this.loading = false;
    });
  }
}



