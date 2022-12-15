import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { HotToastService } from '@ngneat/hot-toast';
import { MenuItem } from 'primeng/api';

import { CourseService } from 'src/app/core/shared/services/course.service';
import { TweetService } from '../../shared/services/tweet.service';
import { ProfileService } from '../../shared/services/profile.service';
import { EventService } from '../../shared/services/event.service';
import { ElectionService } from '../../shared/services/election.service';
import { AuthService } from 'src/app/core/shared/services/auth.service';

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
  defaultImg: any = '../../../../../assets/images/student.png';
  previewImg: any = '';

  tweets: any = [];
  tweet: any = '';

  isLoading: boolean = true;
  reactLoading: boolean = false;
  tweetCommentsModal: boolean = false;
  comment: string = '';
  comments: any = [];
  commentTweetId: any = '';

  profiledata: any = {
    name: null,
    username: null,
    section: null,
    year: null,
    image: null,
    email: null,
    CourseId: null,
  };

  voters: any = [];
  mentionItems: any = [];

  optionItems: MenuItem[]

  constructor(
    private profileService: ProfileService,
    private courseService: CourseService,
    private toast: HotToastService,
    private router: Router,
    private tweetService: TweetService,
    private eventService: EventService,
    private electionService: ElectionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getProfile();
    this.getCourses();
    this.getTweetEvent();

    this.optionItems = [
      { label: 'Edit Info', icon: 'pi pi-fw pi-plus' },
      { label: 'Change Password', icon: 'pi pi-fw pi-download' },
    ];
  }

  logout() {
    this.authService.logout('student');
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
          if (voter.id == this.profile.id) {
            return;
          }

          this.mentionItems.push(voter.username);
        });
      },
      (error: any) => {
        console.log(error);
      }
    );
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
        this.getVoters();

        this.profiledata = {
          name: response.name,
          username: response.username,
          section: response.StudentCredential.section,
          year: response.StudentCredential.year,
          image: response.image,
          email: response.email,
          CourseId: response.StudentCredential.CourseId,
        };

        if (response.image != null) {
          this.previewImg = response.image;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getCourses() {
    this.courseService.getCourses().subscribe(
      (response: any) => {
        this.courses = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  dateFormat(date: any) {
    return moment(date).fromNow();
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

  reactTweet(tweet: any) {
    let indx;

    const res = tweet.TweetReactors.some((reactor: any, idx: any) => {
      if (reactor.UserId == this.profile.id) {
        indx = idx;
        return true;
      }
    });

    if (res) {
      tweet.TweetReactors.splice(indx, 1);
      tweet.reactCount = tweet.reactCount - 1;
    } else {
      tweet.TweetReactors.push({
        UserId: this.profile.id,
      });

      tweet.reactCount = tweet.reactCount + 1;
    }

    if (this.reactLoading == true) {
      return;
    }

    this.reactLoading = true;

    this.tweetService
      .reactTweet({ tweetId: tweet.id, senderId: this.profile.id })
      .subscribe(
        (response: any) => {
          this.reactLoading = false;
          // this.getProfile();
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

  postComment() {
    if (this.comment.trim() == '') {
      this.toast.info('Please type something.');
      return;
    }

    const data: any = {
      tweetId: this.commentTweetId,
      comment: this.comment,
      senderId: this.profile.id,
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

  navigateToUser(id: any) {
    if (id == this.profile.id) {
      return this.router.navigate([`/account`]);
    }

    this.router.navigate([`/user`], {
      queryParams: { id: id },
    });
  }
}
