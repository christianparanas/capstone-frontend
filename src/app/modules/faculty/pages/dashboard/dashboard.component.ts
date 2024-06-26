import { Component, OnInit } from '@angular/core';

import { ProfileService } from '../../shared/services/profile.service';
import { ElectionService } from '../../shared/services/election.service';
import { PollService } from '../../shared/services/poll.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  date: any;
  isMorning: any;
  isAfternoon: any;
  isEvening: any;
  isNight: any;

  profile: any = [];
  elections: any = [];
  polls: any = [];
  voters: any = [];

  votersCount: any = 0;

  constructor(
    private profileService: ProfileService,
    private electionService: ElectionService,
    private pollService: PollService
  ) {}

  ngOnInit(): void {
    this.getProfile();
    this.date = new Date();

    this.getElections();
    this.getPolls();

    this.isMorning = this.date.getHours() > 5 && this.date.getHours() <= 12;
    this.isAfternoon = this.date.getHours() > 12 && this.date.getHours() <= 18;
    this.isEvening = this.date.getHours() > 18 && this.date.getHours() <= 22;
    this.isNight = this.date.getHours() > 22 || this.date.getHours() <= 5;
  }

  getProfile() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.profile = response;

        this.getVoters()
      },
      (error: any) => {}
    );
  }

  getElections() {
    this.electionService.getElections().subscribe((response: any) => {
      response.forEach((election: any) => {
        if (election.stage == 'election_started') {
          this.elections.push(election);
        }
      });
    });
  }

  getPolls() {
    this.pollService.getPolls().subscribe((response: any) => {
      response.forEach((poll: any) => {
        if (poll.published == 1) {
          this.polls.push(poll);
        }
      });
    });
  }

  getVoters() {
    this.electionService.getVoters().subscribe((response: any) => {
      this.voters = response;

      console.log(response)

      if (this.profile.coverage != 0) {
        response.forEach((voter: any) => {
          if (voter.StudentCredential.CourseId == this.profile.coverage) {
            this.votersCount += 1;
          }
        });
      } else {
        this.votersCount = response.length;
      }
    });
  }
}
