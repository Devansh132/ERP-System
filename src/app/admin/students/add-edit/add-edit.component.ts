import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService, CreateStudentRequest } from '../../../core/services/students.service';
import { ClassesService } from '../../../core/services/classes.service';
import { SectionsService } from '../../../core/services/sections.service';
import { UsersService } from '../../../core/services/users.service';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-add-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PagetitleComponent],
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
  breadCrumbItems: Array<{ label: string; link?: string; active?: boolean }>;
  studentForm: FormGroup;
  isEditMode = false;
  studentId: number | null = null;
  loading = false;
  error: string | null = null;
  
  classes: any[] = [];
  sections: any[] = [];
  users: any[] = []; // For user selection

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private studentsService: StudentsService,
    private classesService: ClassesService,
    private sectionsService: SectionsService,
    private usersService: UsersService,
    private toastr: ToastrService
  ) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Students', link: '/admin/students/list' },
      { label: 'Add', active: true }
    ];

    this.studentForm = this.fb.group({
      user_id: ['', Validators.required],
      admission_number: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      gender: [''],
      address: [''],
      phone: [''],
      parent_name: [''],
      parent_phone: [''],
      class_id: ['', Validators.required],
      section_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.studentId = +id;
      this.breadCrumbItems[2].label = 'Edit';
      this.loadStudent();
    } else {
      this.breadCrumbItems[2].label = 'Add';
    }

    this.loadClasses();
    this.loadSections();
    this.loadUsers();
  }

  loadStudent(): void {
    if (!this.studentId) return;

    this.loading = true;
    this.studentsService.getStudent(this.studentId).subscribe({
      next: (student) => {
        this.studentForm.patchValue({
          user_id: student.user_id,
          admission_number: student.admission_number,
          first_name: student.first_name,
          last_name: student.last_name,
          date_of_birth: student.date_of_birth ? student.date_of_birth.split('T')[0] : '',
          gender: student.gender,
          address: student.address,
          phone: student.phone,
          parent_name: student.parent_name,
          parent_phone: student.parent_phone,
          class_id: student.class_id,
          section_id: student.section_id
        });
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error?.error?.error || error?.error || 'Failed to load student', 'Error');
        this.loading = false;
      }
    });
  }

  loadClasses(): void {
    this.classesService.getClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
      },
      error: (error) => {
        console.error('Error loading classes:', error);
      }
    });
  }

  loadSections(): void {
    this.sectionsService.getSections().subscribe({
      next: (sections) => {
        this.sections = sections;
      },
      error: (error) => {
        console.error('Error loading sections:', error);
      }
    });
  }

  loadUsers(): void {
    // Load all users for student creation (user can have any role, will be linked to student)
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.toastr.error(error?.error?.error || error?.error || 'Failed to load users', 'Error');
      }
    });
  }

  onClassChange(): void {
    const classId = this.studentForm.get('class_id')?.value;
    if (classId) {
      this.sectionsService.getSections({ class_id: Number(classId) }).subscribe({
        next: (sections) => {
          this.sections = sections;
          // Reset section selection
          this.studentForm.patchValue({ section_id: '' });
        },
        error: (error) => {
          this.toastr.error(error?.error?.error || error?.error || 'Failed to load sections', 'Error');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.studentForm.value;

    if (this.isEditMode && this.studentId) {
      // Update student
      const updateData: any = {
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        date_of_birth: formValue.date_of_birth,
        gender: formValue.gender,
        address: formValue.address,
        phone: formValue.phone,
        parent_name: formValue.parent_name,
        parent_phone: formValue.parent_phone,
        class_id: Number(formValue.class_id), // Convert to number
        section_id: Number(formValue.section_id) // Convert to number
      };
      
      this.studentsService.updateStudent(this.studentId, updateData).subscribe({
        next: () => {
          this.toastr.success('Student updated successfully', 'Success');
          this.router.navigate(['/admin/students/list']);
        },
        error: (error) => {
          this.toastr.error(error?.error?.error || error?.error || 'Failed to update student', 'Error');
          this.loading = false;
        }
      });
    } else {
      // Create student
      const createData: CreateStudentRequest = {
        user_id: Number(formValue.user_id), // Convert to number
        admission_number: formValue.admission_number,
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        date_of_birth: formValue.date_of_birth,
        gender: formValue.gender,
        address: formValue.address,
        phone: formValue.phone,
        parent_name: formValue.parent_name,
        parent_phone: formValue.parent_phone,
        class_id: Number(formValue.class_id), // Convert to number
        section_id: Number(formValue.section_id) // Convert to number
      };

      this.studentsService.createStudent(createData).subscribe({
        next: () => {
          this.toastr.success('Student created successfully', 'Success');
          this.router.navigate(['/admin/students/list']);
        },
        error: (error) => {
          this.toastr.error(error?.error?.error || error?.error || 'Failed to create student', 'Error');
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/students/list']);
  }
}

