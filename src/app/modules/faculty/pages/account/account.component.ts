import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

import { ProfileService } from '../../shared/services/profile.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  profile: any;
  editModal: boolean = false;
  submitLoading: boolean = false;
  courses: any;
  defaultImg: any = '../../../../../assets/images/faculty.png';
  previewImg: any = '';

  profiledata: any = {
    name: null,
    image: null,
    email: null,
  };

  constructor(
    private location: Location,
    private profileService: ProfileService,
    private toast: HotToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProfile();
  }

  onSubmit() {
    if (this.profiledata.name == '') {
      return this.toast.info('Name is required.', {
        position: 'top-right',
      });
    }

    if (this.profiledata.email == '') {
      return this.toast.info('Email is required.', { position: 'top-right' });
    }

    this.submitLoading = true;

    this.profileService.updateProfile(this.profiledata).subscribe(
      (response: any) => {
        this.toast.success(response.message, { position: 'top-right' });
        this.submitLoading = false;
        this.getProfile();
        this.editModal = false;
      },
      (error: any) => {
        console.log(error);
        this.toast.error(error.error.message, { position: 'top-right' });
        this.submitLoading = false;
      }
    );
  }

  loadInputImgToSrc(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = () => {
      this.previewImg = reader.result;
      this.profiledata.image = reader.result;
    };
  }

  getProfile() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.profile = response;

        this.profiledata = {
          name: response.name,
          image: response.image,
          email: response.email,
        };

        if (response.image != null) {
          this.previewImg = response.image;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/'])
  }

  dateFormat(date: any) {
    return moment(date).fromNow()
  }
}
