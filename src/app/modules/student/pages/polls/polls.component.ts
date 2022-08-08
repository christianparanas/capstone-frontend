import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';

import { PollService } from '../../shared/services/poll.service';
import { ProfileService } from '../../shared/services/profile.service';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.scss'],
})
export class PollsComponent implements OnInit {
  polls: any;
  user: any;

  constructor(
    private toast: HotToastService,
    private pollService: PollService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.user = response;
        this.getPolls();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getPolls() {
    this.pollService.getPolls(this.user.Course.id).subscribe(
      (response: any) => {
        console.log(response);

        this.polls = response;
      },
      (error: any) => {}
    );
  }

  dateFormat(date: any) {
    return moment(date).calendar();
  }
}
