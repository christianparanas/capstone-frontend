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
  isLoading: boolean = true
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
          voted: poll.voted,
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
      } else {
        this.poll.options[index].isSelected = false;
      }
    }
  }

  votePoll() {
    let selectedId: any;

    this.poll.options.forEach((option: any) => {
      if (option.isSelected == true) {
        selectedId = option.id;
      }
    });

    if (!selectedId) {
      this.toast.info('Please select an option to vote.', {
        position: 'top-right',
      });
      return;
    }

    this.submitLoading = true;

    const data: any = {
      pollId: this.poll.id,
      answerId: selectedId,
    };

    this.pollService.votePoll(data).subscribe(
      (response: any) => {
        this.toast.success(response.message, { position: 'top-right' });

        this.submitLoading = false;
        this.votePollModal = false;
        this.getPolls()
      },
      (error: any) => {
        console.log(error);
        this.toast.error(error.error.message, { position: 'top-right' });

        this.submitLoading = false;
      }
    );
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
      async (response: any) => {
        let id = await this.user.id

        for (let i = 0; i < response.length; i++) {
          for (let j = 0; j < response[i].PollVotes.length; j++) {
            if (response[i].PollVotes[j].StudentId == id) {
              response[i].voted = true;
            }
          }
        }

        this.isLoading = false

        this.polls = response;
      },
      (error: any) => {
        this.isLoading = false
      }
    );
  }

  dateFormat(date: any) {
    return moment(date).calendar();
  }
}
