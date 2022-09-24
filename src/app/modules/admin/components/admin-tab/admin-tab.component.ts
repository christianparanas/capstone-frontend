import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

import { AdminService } from '../../shared/services/admin.service';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-tab',
  templateUrl: './admin-tab.component.html',
  styleUrls: ['./admin-tab.component.scss'],
})
export class AdminTabComponent implements OnInit {
  admins: any;
  createAccountModal: boolean = false;
  editAccountModal: boolean = false;
  submitLoading: boolean = false;
  createForm: FormGroup;

  editForm: any = {
    id: null,
    name: null,
    email: null,
  };

  constructor(
    private adminService: AdminService,
    private router: Router,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.getAdmins();

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

    this.submitLoading = true;

    this.adminService.updateAdmin(this.editForm).subscribe(
      (response: any) => {
        this.submitLoading = false;
        this.toast.success(response.message, { position: 'top-right' });
        this.getAdmins();
        this.editAccountModal = false;
      },
      (error: any) => {
        this.submitLoading = false;
        this.toast.error(error.error.message, { position: 'top-right' });
      }
    );
  }

  getAdmins() {
    this.adminService.getAdmins().subscribe(
      (response: any) => {
        this.admins = response;
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

    this.adminService.addAdmin(this.createForm.value).subscribe(
      (response: any) => {
        this.submitLoading = false;
        this.createForm.reset();
        this.createAccountModal = false;
        this.getAdmins();
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
