import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HotToastService } from '@ngneat/hot-toast';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  form: FormGroup
  submitLoading: boolean = false
  isEmailSent: boolean = false

  constructor(private location: Location, private toast: HotToastService, private authService: AuthService) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  onSubmit() {
    if(!this.form.valid) return this.toast.info("Please enter a valid email address")

    this.submitLoading = true

    this.authService.forgotpassword(this.form.value).subscribe((response: any) => {
      this.isEmailSent = true
      this.submitLoading = false
    }, 
    (err: any) => {
      this.submitLoading = false
      this.toast.error(err.error.message)
    })
  }

  goBack() {
    this.location.back()
  }

}
