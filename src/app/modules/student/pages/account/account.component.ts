import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as moment from 'moment';

import { ProfileService } from '../../shared/services/profile.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  profile: any;

  constructor(
    private location: Location,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        console.log(response);

        this.profile = response;
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
