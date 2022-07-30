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
  isNextStep: boolean = true;
  isOpenCamera: boolean = false;

  typeOfAttachment: any = null;

  attachments: any = {
    document: '',
    selfie: '',
  };

  constructor(
    private courseService: CourseService,
    public router: Router,
    private toast: HotToastService,
    private authStudentService: AuthStudentService
  ) {}

  attachFile(file: any) {
    if (this.typeOfAttachment == 'document') {
      this.attachments.document = file;
    }

    if (this.typeOfAttachment == 'selfie') {
      this.attachments.selfie = file;
    }

    this.isOpenCamera = false;
  }

  openCamera(param: number) {
    if (param == 1) {
      this.typeOfAttachment = 'document';
    }

    if (param == 2) {
      this.typeOfAttachment = 'selfie';
    }

    this.isOpenCamera = true;
  }

  submitApplication() {
    if (
      this.signupForm.status == 'VALID' &&
      this.signupForm.controls.password.value.trim() &&
      this.attachments.ducument != '' &&
      this.attachments.selfie != ''
    ) {

      this.submitLoading = true

      const data = {
        ...this.signupForm.value,
        verificationFiles: {
          ...this.attachments,
        },
      };

      this.authStudentService.register(data).subscribe(
        (response: any) => {
          this.submitLoading = false

          this.router.navigate(['/login'])

          this.toast.success(response.message, {
            position: 'top-right',
            autoClose: false,
            dismissible: true
          });
        },
        (error: any) => {
          this.toast.info(error.error.message, {
            position: 'top-right',
          });

          this.submitLoading = false
        }
      );
    } else {
      this.toast.info('Please attach the needed documents.', {
        position: 'top-right',
      });
    }
  }

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
      this.isNextStep = true;
    } else {
      this.toast.error('Please fill out all the fields.', {
        position: 'top-right',
      });
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
