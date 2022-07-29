import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

import { CourseService } from '../../shared/services/course.service';
import { AuthStudentService } from '../../shared/services/auth-student.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  courses: any;
  signupForm: FormGroup;
  submitLoading: boolean = false;
  isNextStep: boolean = false;
  openCamera: boolean = false;

  dateForVerification: any = {
    document: "",
    selfie: ""
  }

  constructor(
    private courseService: CourseService,
    public router: Router,
    private toast: HotToastService,
    private authStudentService: AuthStudentService
  ) {}

  ngOnInit(): void {
    this.getCourses();


    this.signupForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      studentID: new FormControl('', Validators.required),
      course: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (
      this.signupForm.status == 'VALID' &&
      this.signupForm.controls.password.value.trim()
    ) {
      this.isNextStep = true
    }
    else {
      this.toast.error('Please fill out all the fields.', { position: 'top-right' });
    }
  }

  getCourses() {
    this.courseService.getCourses().subscribe(
      (response: any) => {
        this.courses = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
