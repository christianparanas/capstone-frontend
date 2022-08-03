import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

import { FacultyService } from '../../shared/services/faculty.service';

@Component({
  selector: 'app-faculty-tab',
  templateUrl: './faculty-tab.component.html',
  styleUrls: ['./faculty-tab.component.scss'],
})
export class FacultyTabComponent implements OnInit {
  faculties: any;
  createAccountModal: boolean = false;
  submitLoading: boolean = false;
  createForm: FormGroup;

  constructor(
    private facultyService: FacultyService,
    private router: Router,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.getFaculties();

    this.createForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  getFaculties() {
    this.facultyService.getFaculties().subscribe(
      (response: any) => {
        this.faculties = response;
      },
      (error: any) => {
        this.toast.error(error.error.message, { position: 'top-right' });
      }
    );
  }

  onSubmit() {
    if (!this.createForm.valid) {
      this.toast.warning('Please fill out the fields with valid data.', {
        position: 'top-right',
      });
      return
    }

    this.submitLoading = true;

    this.facultyService.addFaculty(this.createForm.value).subscribe(
      (response: any) => {
        this.submitLoading = false;
        this.createForm.reset();
        this.createAccountModal = false;
        this.getFaculties();
        this.toast.success(response.message, { position: 'top-right' });
      },
      (error: any) => {
        this.submitLoading = false;
        this.toast.error(error.error.message, { position: 'top-right' });
      }
    );
  }
}
