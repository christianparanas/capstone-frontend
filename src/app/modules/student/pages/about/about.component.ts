import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';

import { FeedbackService } from '../../shared/services/feedback.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  feedbacks: any
  rating: any = 0;
  message: any = "";

  constructor(
    private feedbackService: FeedbackService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.getFeedbacks();
  }

  onRating() {}

  postFeedback() {
    console.log(this.rating)

    if (this.rating == 0) {
      this.toast.info('Please select a rating.', { position: 'top-right' });
      return
    }

    this.feedbackService
      .addFeedback({
        rating: this.rating,
        message: this.message
      })
      .subscribe(
        (response: any) => {
          console.log(response);

          this.getFeedbacks()

          // clear data
          this.rating = 0
          this.message = ""

          this.toast.info('Your feedback has been recorded. It will undergo a checking before being published to avoid spamming.', { position: 'top-right' });
        },
        (error: any) => {
          console.log(error);
          this.toast.error(error.error.message, { position: 'top-right' });
        }
      );
  }

  getFeedbacks() {
    this.feedbackService.getFeedbacks().subscribe(
      (response: any) => {
        console.log(response);

        this.feedbacks = response
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
