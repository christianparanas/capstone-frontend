import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

import { CourseService } from '../../shared/services/course.service';
import { AuthService } from '../../shared/services/auth.service';

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
  isOpenCamera: boolean = false;

  typeOfAttachment: any = null;

  schoolIdInput: any = null
  courseInput: any = null

  attachments: any = {
    document: '',
    selfie: '',
  };

  constructor(
    private courseService: CourseService,
    public router: Router,
    private toast: HotToastService,
    private authService: AuthService
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
      this.submitLoading = true;

      const data = {
        ...this.signupForm.value,
        schoolId: this.schoolIdInput,
        courseId: this.courseInput.id,
        verificationFiles: {
          ...this.attachments,
        },
      };

      console.log(data)

      this.authService.studentRegister(data).subscribe(
        (response: any) => {
          this.submitLoading = false;

          // this.router.navigate([`/login`], {
          //   queryParams: { type: 'student' },
          // });

          this.toast.success(response.message, {
            autoClose: false,
            dismissible: true,
          });
        },
        (error: any) => {
          this.toast.info(error.message);
          this.submitLoading = false;
        }
      );
    } else {
      this.toast.info('Please attach the needed documents.');
    }
  }

  ngOnInit(): void {
    this.getCourses();

    this.signupForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      // schoolId: new FormControl('', Validators.required),
      section: new FormControl(''),
      year: new FormControl('', Validators.required),
      // courseId: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (
      this.signupForm.status == 'VALID' &&
      this.signupForm.controls.password.value.trim() &&
      this.schoolIdInput != null && this.schoolIdInput != '' &&
      this.courseInput != null
    ) {
      this.isNextStep = true;
    } else {
      this.toast.error('Please fill out all the required fields.');
    }
  }

  getCourses() {
    this.courseService.getCourses().subscribe(
      (response: any) => {
        this.courses = response;
      },
      (error: any) => {}
    );
  }
}
