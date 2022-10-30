import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
  voters: any = [];
  elections: any = []
  polls: any = []

  constructor(
    private profileService: ProfileService,
    private electionService: ElectionService,
    private router: Router,
    private route: ActivatedRoute,
    private pollService: PollService
  ) {}

  ngOnInit(): void {
    this.getProfile();
    this.getVoters();
    this.getPolls()
    this.getElections()
    this.date = new Date();

    this.isMorning = this.date.getHours() > 5 && this.date.getHours() <= 12;
    this.isAfternoon = this.date.getHours() > 12 && this.date.getHours() <= 18;
    this.isEvening = this.date.getHours() > 18 && this.date.getHours() <= 22;
    this.isNight = this.date.getHours() > 22 || this.date.getHours() <= 5;
  }

  getProfile() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.profile = response;
      },
      (error: any) => {}
    );
  }

  getElections() {
    this.electionService.getElections().subscribe((response: any) => {
      response.forEach((election: any) => {
        if(election.stage == 'election_started') {
          this.elections.push(election)
        }
      });
    });
  }

  getPolls() {
    this.pollService.getPolls({}).subscribe((response: any) => {
      response.forEach((poll: any) => {
        if(poll.published == 1) {
          this.polls.push(poll)
        }
      });
    });
  }

  getVoters() {
    this.electionService.getVoters({}).subscribe((response: any) => {
      this.voters = response;
    });
  }
}
