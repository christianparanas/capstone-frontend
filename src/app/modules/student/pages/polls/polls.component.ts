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
  poll: any;
  user: any;
  votePollModal: boolean = false;
  submitLoading: boolean = false;

  constructor(
    private toast: HotToastService,
    private pollService: PollService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  openPoll(id: any) {
    this.polls.forEach(async (poll: any) => {
      if (poll.id == id) {
        const options: any = [];

        for (
          let index = 0;
          index < poll.PollQuestion.PollAnswers.length;
          index++
        ) {
          options.push({
            ...poll.PollQuestion.PollAnswers[index],
            isSelected: false,
          });
        }

        this.poll = {
          id: id,
          question: poll.PollQuestion.question,
          options: options,
        };

        console.log(this.poll);

        this.votePollModal = true;
      }
    });
  }

  selectOption(id: any) {
    for (let index = 0; index < this.poll.options.length; index++) {
      if (this.poll.options[index].id == id) {
        this.poll.options[index].isSelected = true;
      }
      else {
        this.poll.options[index].isSelected = false;
      }
    }

    console.log(this.poll)
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
