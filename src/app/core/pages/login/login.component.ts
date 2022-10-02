import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { ActivatedRoute, Router } from '@angular/router';

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
    private route: ActivatedRoute,
    private authStudentService: AuthStudentService,
    private authFacultyService: AuthFacultyService,
    private authAdminService: AuthAdminService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });

    this.route.queryParams.subscribe((value) => {
      switch (value.type) {
        case 'student':
          this.loginAcctType = 'student';
          break;
        case 'faculty':
          this.loginAcctType = 'faculty';
          break;

        case 'admin':
          this.loginAcctType = 'admin';
          break;
      }
    });
  }

  changeLoginAcctType(type: string) {
    switch (type) {
      case 'student':
        this.loginAcctType = 'student';
        this.router.navigate([`/login`], {
          queryParams: { type: 'student' },
        });
        break;

      case 'faculty':
        this.loginAcctType = 'faculty';
        this.router.navigate([`/login`], {
          queryParams: { type: 'faculty' },
        });
        break;

      case 'admin':
        this.loginAcctType = 'admin';
        this.router.navigate([`/login`], {
          queryParams: { type: 'admin' },
        });
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

      if (this.loginAcctType == 'student') {
        this.tempService = this.authStudentService;
      }

      if (this.loginAcctType == 'faculty') {
        this.tempService = this.authFacultyService;
      }

      if (this.loginAcctType == 'admin') {
        this.tempService = this.authAdminService;
      }

      this.tempService.login(this.loginForm.value).subscribe(
        (response: any) => {
          this.submitLoading = false;
          this.tempService.setSession(response);
          this.toast.success(response.message);
          this.loginForm.reset();
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
