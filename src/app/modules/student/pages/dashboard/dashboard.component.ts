import { Component, OnInit } from '@angular/core';

import { PushNotificationsService } from 'ng-push-ivy';
import { ProfileService } from '../../shared/services/profile.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  profile: any = []

  date: any
  isMorning: any;
  isAfternoon: any;
  isEvening: any;
  isNight: any;

  constructor(private _pushNotifications: PushNotificationsService, private profileService: ProfileService) {}

  ngOnInit(): void {
    this._pushNotifications.requestPermission();

    this.getProfile()
    this.date = new Date();

    this.isMorning = this.date.getHours() > 5 && this.date.getHours() <= 12;
    this.isAfternoon = this.date.getHours() > 12 && this.date.getHours() <= 18;
    this.isEvening = this.date.getHours() > 18 && this.date.getHours() <= 22;
    this.isNight = this.date.getHours() > 22 || this.date.getHours() <= 5;
  }

  showPush() {

    this._pushNotifications.create('New Alert', {body: 'something' }).subscribe(
      res => console.log(res),
      err => console.log(err)
    );
  }

  getProfile() {
    this.profileService.getProfile().subscribe((response: any) => {
      this.profile = response
    }, (error: any) => {})
  }
}
