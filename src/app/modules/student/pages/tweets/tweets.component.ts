import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';

import { TweetService } from '../../shared/services/tweet.service';
import { ProfileService } from '../../shared/services/profile.service';
import { EventService } from '../../shared/services/event.service';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.scss'],
})
export class TweetsComponent implements OnInit {
  tweet: string = '';
  tweets: any;
  user: any;
  submitLoading: boolean = false;
  isLoading: boolean = false;
  reactLoading: boolean = false;

  constructor(
    private toast: HotToastService,
    private tweetService: TweetService,
    private profileService: ProfileService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getTweets();
    this.getTweetEvent();
  }

  getTweetEvent() {
    this.eventService.getTweetEvent().subscribe((response: any) => {
      this.getTweets();
    });
  }

  getUser() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.user = response;
      },
      (error: any) => {}
    );
  }

  checkReactors(reactors: any) {
    let bool;

    reactors.forEach((reactor: any) => {
      if (reactor.StudentId == this.user.id) {
        bool = true;
        return;
      }
    });

    return bool;
  }

  getTweets() {
    this.tweetService.getTweets().subscribe(
      (response: any) => {
        console.log(response);

        this.isLoading = true;

        this.tweets = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  reactTweet(tweetId: number) {
    if (this.reactLoading == true) {
      return;
    }

    this.reactLoading = true;

    this.tweetService.reactTweet({ tweetId: tweetId }).subscribe(
      (response: any) => {
        this.reactLoading = false;
        this.getTweets();
        this.eventService.sendTweetEvent();
      },
      (error: any) => {
        console.log(error);
        this.reactLoading = false;
      }
    );
  }

  postTweet() {
    if (this.tweet.trim() == '') {
      this.toast.info('Please type something.', { position: 'top-right' });
      return;
    }

    this.submitLoading = true;

    const data = {
      message: this.tweet,
    };

    this.tweetService.postTweet(data).subscribe(
      (response: any) => {
        this.getTweets();
        this.toast.success(response.message, { position: 'top-right' });
        this.submitLoading = false;
        this.eventService.sendTweetEvent();

        this.tweet = '';
      },
      (error: any) => {
        console.log(error);
        this.toast.error(error.error.message, { position: 'top-right' });
        this.submitLoading = false;
      }
    );
  }

  dateFormat(date: any) {
    return moment(date).format('llll');
  }
}
