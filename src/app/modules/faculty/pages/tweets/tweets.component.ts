import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';

import { TweetService } from '../../shared/services/tweet.service';
import { EventService } from '../../shared/services/event.service';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.scss'],
})
export class TweetsComponent implements OnInit {
  defaultImg: any = '../../../../../assets/images/student.png';
  tweet: string = '';
  tweets: any;
  user: any;
  submitLoading: boolean = false;
  isLoading: boolean = true;
  reactLoading: boolean = false;
  tweetCommentsModal: boolean = false;
  comment: string = '';
  comments: any = [];
  commentTweetId: any = '';

  constructor(
    private toast: HotToastService,
    private tweetService: TweetService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.getTweets();
    this.getTweetEvent();
  }
  

  getTweetEvent() {
    this.eventService.getTweetEvent().subscribe((response: any) => {
      this.getTweets();
    });
  }

  commentTrack(item: any, index: any) {
    return `${item.id}-${index}`;
  }

  openCommentModal(tweetId: any) {
    this.tweetCommentsModal = true;

    this.tweets.forEach((tweet: any) => {
      if (tweet.id == tweetId) {
        this.comments = tweet.TweetComments;
      }
    });

    this.commentTweetId = tweetId;
  }

  getTweets() {
    this.tweetService.getTweets().subscribe(
      (response: any) => {
        this.tweets = response;
        console.log(response);
        this.isLoading = false;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  dateFormat(date: any) {
    return moment(date).format('llll');
  }
}
