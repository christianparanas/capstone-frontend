import { Component, OnInit } from '@angular/core';

import { PushNotificationsService } from 'ng-push-ivy';
import { ProfileService } from '../../shared/services/profile.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private _pushNotifications: PushNotificationsService, private profileService: ProfileService) {}

  ngOnInit(): void {
    this._pushNotifications.requestPermission();
  }

  showPush() {

    this._pushNotifications.create('New Alert', {body: 'something' }).subscribe(
      res => console.log(res),
      err => console.log(err)
    );
  }
}
