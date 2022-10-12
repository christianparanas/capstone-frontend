import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

import { StudentService } from '../../shared/services/student.service';
import { CourseService } from 'src/app/core/shared/services/course.service';

@Component({
  selector: 'app-student-tab',
  templateUrl: './student-tab.component.html',
  styleUrls: ['./student-tab.component.scss'],
})
export class StudentTabComponent implements OnInit {
  students: any = [];
  courses: any = [];
  pendingStudentApplications: any;

  createAccountModal: boolean = false;
  submitLoading: boolean = false;

  createForm: FormGroup;

  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
    private router: Router,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.getStudents();
    this.getPendingStudentAccountApplications();
    this.getCourses();

    this.createForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      studentID: new FormControl('', [Validators.required]),
      course: new FormControl('', [Validators.required]),
      section: new FormControl('', [Validators.required]),
      year: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
    });
  }

  getStudents() {
    this.studentService.getStudents().subscribe(
      (response: any) => {
        this.students = response;
      },
      (error: any) => {}
    );
  }

  getCourses() {
    this.courseService.getCourses().subscribe(
      (response: any) => {
        this.courses = response;
      },
      (error: any) => {}
    );
  }

  getPendingStudentAccountApplications() {
    this.studentService.getPendingStudentAccountApplications().subscribe(
      (response: any) => {
        this.pendingStudentApplications = response;
      },
      (error: any) => {}
    );
  }

  onSubmit() {
    if (!this.createForm.valid) {
      this.toast.warning('Please fill out the fields with valid data.', {
        position: 'top-right',
      });
      return;
    }

    this.submitLoading = true;

    this.studentService.createStudentAccount(this.createForm.value).subscribe(
      (response: any) => {
        this.submitLoading = false;
        this.createForm.reset();
        this.createAccountModal = false;
        this.getStudents();
        this.toast.success(response.message);
      },
      (error: any) => {
        this.submitLoading = false;
        this.toast.error(error.error.message);
      }
    );
  }
}
