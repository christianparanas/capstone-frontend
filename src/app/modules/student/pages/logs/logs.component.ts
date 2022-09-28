import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { LogService } from '../../shared/services/log.service';
import { ProfileService } from '../../shared/services/profile.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit {
  logs: any[];
  userId: any;

  constructor(
    private logService: LogService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getLogs() {
    this.logService.getLogs(this.userId).subscribe(
      (response: any) => {
        this.logs = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getUser() {
    this.profileService.getProfile().subscribe((response: any) => {
      this.userId = response.id;

      this.getLogs();
    });
  }

  dateFormat(date: any) {
    return moment(date).calendar();
  }
}
