import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

import { FacultyService } from '../../shared/services/faculty.service';
import * as moment from 'moment';

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
  editAccountModal: boolean = false;

  editForm: any = {
    id: null,
    name: null,
    email: null,
  };

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

  openEditModal(data: any) {
    this.editForm = {
      id: data.id,
      name: data.name,
      email: data.email,
    };

    this.editAccountModal = true;
  }

  editFormSubmit() {
    if (this.editForm.name == '') {
      return this.toast.info('Name is required.', { position: 'top-right' });
    }

    if (this.editForm.email == '') {
      return this.toast.info('Email is required.', { position: 'top-right' });
    }

    this.submitLoading = true

    this.facultyService.updateFaculty(this.editForm).subscribe(
      (response: any) => {
        this.toast.success(response.message, { position: 'top-right' });
        this.getFaculties();
        this.submitLoading = false
        this.editAccountModal = false;
      },
      (error: any) => {
        this.submitLoading = false
        this.toast.error(error.error.message, { position: 'top-right' });
        console.log(error);
      }
    );
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
      return;
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

  momentFormatLLL(date: any) {
    return moment(date).format('lll');
  }
}
