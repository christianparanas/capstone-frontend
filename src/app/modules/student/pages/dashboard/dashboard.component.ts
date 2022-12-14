import { Component, OnInit } from '@angular/core';

import { PushNotificationsService } from 'ng-push-ivy';
import { ProfileService } from '../../shared/services/profile.service';
import { ElectionService } from '../../shared/services/election.service';
import { PollService } from '../../shared/services/poll.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  profile: any = [];

  date: any;
  isMorning: any;
  isAfternoon: any;
  isEvening: any;
  isNight: any;

  elections: any = [];
  polls: any = [];

  constructor(
    private _pushNotifications: PushNotificationsService,
    private profileService: ProfileService,
    private electionService: ElectionService,
    private pollService: PollService
  ) {}

  ngOnInit(): void {
    // this._pushNotifications.requestPermission();

    this.getProfile();
    this.date = new Date();

    this.isMorning = this.date.getHours() > 5 && this.date.getHours() <= 12;
    this.isAfternoon = this.date.getHours() > 12 && this.date.getHours() <= 18;
    this.isEvening = this.date.getHours() > 18 && this.date.getHours() <= 22;
    this.isNight = this.date.getHours() > 22 || this.date.getHours() <= 5;
  }

  showPush() {
    this._pushNotifications
      .create('New Alert', { body: 'something' })
      .subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
      );
  }

  getProfile() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.profile = response;
        this.getElections();
        this.getPolls()
      },
      (error: any) => {}
    );
  }

  getElections() {
    const data = {
      section: this.profile.StudentCredential.section,
      year: this.profile.StudentCredential.year,
      CourseId: this.profile.StudentCredential.CourseId,
    };

    this.electionService.getElections(data).subscribe((response: any) => {
      if (response.length > 0) {
        response.forEach((election: any) => {
          if (election.stage == 'election_started') {
            this.elections.push(election);
          }
        });
      }
    });
  }

  getPolls() {
    const data = {
      section: this.profile.StudentCredential.section,
      year: this.profile.StudentCredential.year,
      CourseId: this.profile.StudentCredential.CourseId,
    };

    this.pollService.getPolls(data).subscribe((response: any) => {
      this.polls = response;

      console.log(response)
    });
  }
}
