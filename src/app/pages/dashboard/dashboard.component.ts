import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  stats = [
    {
      title: 'Total Users',
      count: 24,
      change: '+12%',
      icon: 'mdi-account-multiple-outline',
      color: 'primary',
      desc: 'since last month'
    },
    {
      title: 'Total Students',
      count: 156,
      change: '+8%',
      icon: 'mdi-school-outline',
      color: 'info',
      desc: 'since last month'
    },
    {
      title: 'Scheduled Interviews',
      count: 32,
      extra: '5 today · 3 pending approval',
      icon: 'mdi-calendar-clock',
      color: 'warning'
    }
  ];

  quickActions = [
    { icon: 'mdi-account-plus', label: 'Add Student', desc: 'Create a new student profile' },
    { icon: 'mdi-account-plus-outline', label: 'Add User', desc: 'Add new interviewer, agent or counselor' },
    { icon: 'mdi-calendar-plus', label: 'Schedule Interview', desc: 'Match a student to an interviewer' },
    { icon: 'mdi-currency-usd', label: 'Upgrade Plan', desc: 'Jump to upgrade/checkout screen' },
    { icon: 'mdi-receipt', label: 'Billing & Invoices', desc: 'View/download past payments, add card' },
  ];

  systemStatus = {
    status: 'Active',
    toggle: true,
    recentPerformance: [90, 91, 94, 88, 95, 97, 92],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    results: [
      { name: 'Emily Johnson', match: 92 },
      { name: 'Michael Chen', match: 78 },
      { name: 'Sarah Williams', match: 45 }
    ]
  };

  activityFeed = [
    {
      title: 'New student added',
      time: 'Today, 10:45 AM',
      desc: 'Rachel Thompson was added to the system.',
      icon: 'mdi-account-plus'
    },
    {
      title: 'Interview scheduled',
      time: 'Today, 9:30 AM',
      desc: 'Daniel Martinez scheduled for interview with Dr. Rebecca Lee',
      icon: 'mdi-calendar-check'
    },
    {
      title: 'Plan changed',
      time: 'Yesterday, 4:15 PM',
      desc: 'Account upgraded from Basic to Premium',
      icon: 'mdi-arrow-up-bold-box'
    },
    {
      title: 'Payment processed',
      time: 'Yesterday, 4:14 PM',
      desc: '$199.00 payment for Premium Plan (Annual)',
      icon: 'mdi-credit-card-check'
    },
    {
      title: 'Interview cancelled',
      time: 'June 15, 2025',
      desc: 'Cancelled interview with Dr. Michael Johnson due to conflict',
      icon: 'mdi-calendar-remove'
    }
  ];
}
