import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

import { AuthStudentService } from '../../shared/services/auth-student.service';
import { AuthFacultyService } from '../../shared/services/auth-faculty.service';
import { AuthAdminService } from '../../shared/services/auth-admin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginAcctType: String = 'student';
  loginForm: FormGroup;
  submitLoading: boolean = false;
  tempService: any;

  constructor(
    public router: Router,
    private toast: HotToastService,
    private authStudentService: AuthStudentService,
    private authFacultyService: AuthFacultyService,
    private authAdminService: AuthAdminService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  changeLoginAcctType(type: string) {
    switch (type) {
      case 'student':
        this.loginAcctType = 'student';
        break;

      case 'faculty':
        this.loginAcctType = 'faculty';
        break;

      case 'admin':
        this.loginAcctType = 'admin';
        break;

      default:
        break;
    }
  }

  onSubmit() {
    if (
      this.loginForm.status == 'VALID' &&
      this.loginForm.controls.password.value.trim()
    ) {
      this.submitLoading = true;

      switch (this.loginAcctType) {
        case 'student':
          this.tempService = this.authStudentService;
          break;

        case 'faculty':
          this.tempService = this.authFacultyService;
          break;

        case 'admin':
          this.tempService = this.authAdminService;
          break;

        default:
          break;
      }

      this.tempService.login(this.loginForm.value).subscribe(
        (response: any) => {
          this.submitLoading = false;
          this.toast.success(response.message, { position: 'top-right' });

          this.loginForm.reset()

          if(this.loginAcctType == "student") this.router.navigate(['/']);
          if(this.loginAcctType == "faculty") this.router.navigate(['/faculty']);
          if(this.loginAcctType == "admin") this.router.navigate(['/admin']);
        },
        (error: any) => {
          this.submitLoading = false;
          let result: any;

          if (error.status == 0) {
            result = 'Server is down!';
          } else if (error.status == 401) {
            result = error.error.message;
          } else if (error.status == 422) {
            result = error.error.email[0];
          } else if (error.status == 500) {
            result = error.statusText;
          }
          this.toast.error(result, { position: 'top-right' });
        }
      );
    } else {
      this.toast.error('Invalid Email or Password', { position: 'top-right' });
    }
  }
}
