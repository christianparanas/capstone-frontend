import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { HotToastService } from '@ngneat/hot-toast';

import { FeedbackService } from '../../shared/services/feedback.service';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss'],
})
export class FeedbacksComponent implements OnInit {
  needReviewFeedbacks: any;
  feedbacks: any;

  constructor(
    private feedbackService: FeedbackService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.getFeedbacks();
    this.getNeedReviewFeedbacks();
  }

  getNeedReviewFeedbacks() {
    this.feedbackService.getPendingFeedbacks().subscribe(
      (response: any) => {
        this.needReviewFeedbacks = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  changeFeedbackStatus(feedbackId: number, decision: string) {
    this.feedbackService
      .changeFeedbackStatus({ feedbackId, decision })
      .subscribe(
        (response: any) => {
          this.getFeedbacks();
          this.getNeedReviewFeedbacks();

          this.toast.success(response.message, { position: 'top-right' });
        },
        (error: any) => {
          this.toast.error(error.error.message, { position: 'top-right' });
        }
      );
  }

  getFeedbacks() {
    this.feedbackService.getFeedbacks().subscribe(
      (response: any) => {
        this.feedbacks = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  momentFormatLLL(date: any) {
    return moment(date).format('lll');
  }
}
