import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { HotToastService } from '@ngneat/hot-toast';

import { CourseService } from 'src/app/core/shared/services/course.service';
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
  defaultImg: any = '../../../../../assets/images/student.png';
  previewImg: any = '';

  profiledata: any = {
    name: null,
    section: null,
    year: null,
    image: null,
    email: null,
    CourseId: null,
  };

  constructor(
    private location: Location,
    private profileService: ProfileService,
    private courseService: CourseService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.getProfile();
    this.getCourses();
  }

  onSubmit() {
    if (this.profiledata.firstName == '') {
      return this.toast.info('First name is required.', {
        position: 'top-right',
      });
    }

    if (this.profiledata.lastName == '') {
      return this.toast.info('Last name is required.', {
        position: 'top-right',
      });
    }

    if (this.profiledata.email == '') {
      return this.toast.info('Email is required.', { position: 'top-right' });
    }

    this.submitLoading = true;

    this.profileService.updateProfile(this.profiledata).subscribe(
      (response: any) => {
        console.log(response);
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
        console.log(response);
        this.profile = response;

        this.profiledata = {
          name: response.name,
          section: response.StudentCredential.section,
          year: response.StudentCredential.year,
          image: response.image,
          email: response.email,
          CourseId: response.StudentCredential.courseId,
        };

        if(response.image != null) {
          this.previewImg = response.image
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
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

  goBack(): void {
    this.location.back();
  }

  dateFormat(date: any) {
    return moment(date).format('llll');
  }
}
