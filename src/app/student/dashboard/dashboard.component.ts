import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, PagetitleComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  constructor() {
    this.breadCrumbItems = [
      { label: 'Student' },
      { label: 'Dashboard', active: true }
    ];
  }

  ngOnInit(): void {
    // Student dashboard will be implemented later
  }
}

