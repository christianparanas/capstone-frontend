import { Component, OnInit } from '@angular/core';


import { PushNotificationsService } from 'ng-push-ivy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private _pushNotifications: PushNotificationsService) {}


  ngOnInit(): void {
    this._pushNotifications.requestPermission();
  }
}
