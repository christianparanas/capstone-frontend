import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

import { TweetService } from '../../shared/services/tweet.service';
import { ProfileService } from '../../shared/services/profile.service';
import { EventService } from '../../shared/services/event.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  profile: any;
  editModal: boolean = false;
  submitLoading: boolean = false;
  courses: any;
  defaultImg: any = '../../../../../assets/images/faculty.png';
  previewImg: any = '';

  profiledata: any = {
    name: null,
    username: null,
    image: null,
    email: null,
  };

  tweets: any = [];
  tweet: any = '';

  isLoading: boolean = true;
  reactLoading: boolean = false;
  tweetCommentsModal: boolean = false;
  comment: string = '';
  comments: any = [];
  commentTweetId: any = '';

  constructor(
    private profileService: ProfileService,
    private toast: HotToastService,
    private router: Router,
    private tweetService: TweetService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.getProfile();
  }

  onSubmit() {
    if (this.profiledata.name == '') {
      return this.toast.info('Name is required.', {
        position: 'top-right',
      });
    }

    if (this.profiledata.username == '') {
      return this.toast.info('Username is required.', {
        position: 'top-right',
      });
    }

    if (this.profiledata.email == '') {
      return this.toast.info('Email is required.');
    }

    this.submitLoading = true;

    this.profileService.updateProfile(this.profiledata).subscribe(
      (response: any) => {
        this.toast.success(response.message);
        this.submitLoading = false;
        this.getProfile();
        this.editModal = false;
      },
      (error: any) => {
        console.log(error);
        this.toast.error(error.error.message);
        this.submitLoading = false;
      }
    );
  }

  loadInputImgToSrc(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = () => {
      this.previewImg = reader.result;
      this.profiledata.image = reader.result;
    };
  }

  getProfile() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.profile = response;

        this.tweets = response.Tweets;

        response.Tweets.forEach((tweet: any) => {
          if (tweet.id == this.commentTweetId) {
            this.comments = tweet.TweetComments;
          }
        });

        this.submitLoading = false;

        this.profiledata = {
          name: response.name,
          image: response.image,
          username: response.username,
          email: response.email,
        };

        if (response.image != null) {
          this.previewImg = response.image;
        }
      },
      (error: any) => {}
    );
  }

  postComment() {
    if (this.comment.trim() == '') {
      this.toast.info('Please type something.');
      return;
    }

    const data: any = {
      tweetId: this.commentTweetId,
      comment: this.comment,
      UserId: this.profile.id,
    };

    this.tweetService.postTweetComment(data).subscribe(
      (response: any) => {
        this.getProfile();
        this.comment = '';
        this.eventService.sendTweetEvent();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getTweetEvent() {
    this.eventService.getTweetEvent().subscribe((response: any) => {
      this.getProfile();
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

  checkReactors(reactors: any) {
    let bool;

    reactors.forEach((reactor: any) => {
      if (reactor.UserId == this.profile.id) {
        bool = true;
        return;
      }
    });

    return bool;
  }

  reactTweet(tweetId: number) {
    if (this.reactLoading == true) {
      return;
    }

    this.reactLoading = true;

    this.tweetService
      .reactTweet({ tweetId: tweetId, UserId: this.profile.id })
      .subscribe(
        (response: any) => {
          this.reactLoading = false;
          this.getProfile();
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
      UserId: this.profile.id,
    };

    this.tweetService.postTweet(data).subscribe(
      (response: any) => {
        this.getProfile();
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

  goBack(): void {
    this.router.navigate(['/faculty/']);
  }

  dateFormat(date: any) {
    return moment(date).format('llll');
  }

  navigateToUser(id: any) {
    if (id == this.profile.id) {
      return;
    }

    this.router.navigate([`/admin/user`], {
      queryParams: { id: id },
    });
  }
}
