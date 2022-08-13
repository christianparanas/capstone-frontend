import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { TweetService } from '../../shared/services/tweet.service';
import { ProfileService } from '../../shared/services/profile.service';
import { EventService } from '../../shared/services/event.service';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss'],
})
export class TweetComponent implements OnInit {
  tweetId: any;
  tweet: any;
  user: any;
  submitLoading: boolean = false;
  reactLoading: boolean = false;

  constructor(
    private toast: HotToastService,
    private tweetService: TweetService,
    private profileService: ProfileService,
    private eventService: EventService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((value) => {
      this.tweetId = value.id;
    });

    this.getUser();
    this.getTweet()
  }

  getTweet() {
    this.tweetService.getTweet(this.tweetId).subscribe(
      (response: any) => {
        this.tweet = response

        console.log(response)
      },
      (error: any) => {
        console.log(error)
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

  getUser() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.user = response;
      },
      (error: any) => {}
    );
  }
}
