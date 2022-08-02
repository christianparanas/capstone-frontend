import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';

import { TweetService } from '../../shared/services/tweet.service';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.scss'],
})
export class TweetsComponent implements OnInit {
  tweet: string = '';
  tweets: any;
  submitLoading: boolean = false;

  constructor(
    private toast: HotToastService,
    private tweetService: TweetService
  ) {}

  ngOnInit(): void {
    this.getTweets();
  }

  getTweets() {
    this.tweetService.getTweets().subscribe(
      (response: any) => {
        console.log(response);

        this.tweets = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  postTweet() {
    if (this.tweet == '') {
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
