import { Component, OnInit } from '@angular/core';
import { PushNotificationsService } from 'ng-push-ivy';

import { AppUpdateService } from './core/shared/services/app-update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private _pushNotifications: PushNotificationsService, private appUpdate: AppUpdateService) {
    this.appUpdate
  }


  ngOnInit(): void {
    this._pushNotifications.requestPermission();
  }
}
