import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';
import { Router } from '@angular/router';

import { TweetService } from '../../shared/services/tweet.service';
import { ProfileService } from '../../shared/services/profile.service';
import { EventService } from '../../shared/services/event.service';
import { ElectionService } from '../../shared/services/election.service';

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

  voters: any = [];
  mentionItems: any = [];

  constructor(
    private toast: HotToastService,
    private tweetService: TweetService,
    private profileService: ProfileService,
    private eventService: EventService,
    private router: Router,
    private electionService: ElectionService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getTweetEvent();
    this.getVoters();
  }

  getTweetEvent() {
    this.eventService.getTweetEvent().subscribe((response: any) => {
      this.getTweets();
    });
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

  commentTrack(item: any, index: any) {
    return `${item.id}-${index}`;
  }

  postComment() {
    if (this.comment.trim() == '') {
      this.toast.info('Please type something.');
      return;
    }

    const data: any = {
      tweetId: this.commentTweetId,
      comment: this.comment,
      UserId: this.user.id,
    };

    this.tweetService.postTweetComment(data).subscribe(
      (response: any) => {
        this.getTweets();
        this.comment = '';
        this.eventService.sendTweetEvent();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getUser() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.user = response;
        this.getTweets();
      },
      (error: any) => {}
    );
  }

  checkReactors(reactors: any) {
    let bool;

    reactors.forEach((reactor: any) => {
      if (reactor.UserId == this.user.id) {
        bool = true;
        return;
      }
    });

    return bool;
  }

  getTweets() {
    this.tweetService.getTweets().subscribe(
      (response: any) => {
        this.tweets = response;

        response.forEach((tweet: any) => {
          if (tweet.id == this.commentTweetId) {
            this.comments = tweet.TweetComments;
          }
        });

        this.isLoading = false;
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

    this.tweetService
      .reactTweet({ tweetId: tweetId, UserId: this.user.id })
      .subscribe(
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
      this.toast.info('Please type something.');
      return;
    }

    this.submitLoading = true;

    const data = {
      message: this.tweet,
      UserId: this.user.id,
    };

    this.tweetService.postTweet(data).subscribe(
      (response: any) => {
        this.getTweets();
        this.toast.success(response.message);
        this.submitLoading = false;
        this.eventService.sendTweetEvent();

        this.tweet = '';
      },
      (error: any) => {
        console.log(error);
        this.toast.error(error.error.message);
        this.submitLoading = false;
      }
    );
  }

  dateFormat(date: any) {
    return moment(date).fromNow();
  }

  getVoters() {
    const data = {
      course: 0,
      section: 0,
      year: 0,
    };

    this.electionService.getVoters(data).subscribe(
      (response: any) => {
        this.voters = response;
        this.isLoading = false;

        response.forEach(async (voter: any) => {
          this.mentionItems.push(voter.username);
        });
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  navigateToUser(id: any) {
    if (id == this.user.id) {
      return this.router.navigate([`/account`]);
    }

    this.router.navigate([`/user`], {
      queryParams: { id: id },
    });
  }
}
