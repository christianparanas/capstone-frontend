import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';

import { FeedbackService } from '../../shared/services/feedback.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  defaultImg: any = '../../../../../assets/images/student.png';
  feedbacks: any = false;
  rating: any = 0;
  message: any = '';
  submitLoading: boolean = false;

  constructor(
    private feedbackService: FeedbackService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.getApprovedFeedbacks();
  }

  onRating() {}

  postFeedback() {
    if (this.rating == 0) {
      this.toast.info('Please select a rating.');
      return;
    }

    this.submitLoading = true;

    this.feedbackService
      .addFeedback({
        rating: this.rating,
        message: this.message,
      })
      .subscribe(
        (response: any) => {
          this.getApprovedFeedbacks();

          this.submitLoading = false;

          // if (this.message) {
          //   this.toast.info(
          //     'Your feedback has been recorded. It will undergo a checking before being published to avoid spamming.',
          //     { position: 'top-right' }
          //   );
          // }

            this.toast.success('Your rating has been added. Many thanks!', {
              position: 'top-right',
            });
          

          // clear data
          this.rating = 0;
          this.message = '';
        },
        (error: any) => {
          this.toast.error(error.error.message);
          this.submitLoading = false;
        }
      );
  }

  getApprovedFeedbacks() {
    this.feedbackService.getApprovedFeedbacks().subscribe(
      (response: any) => {
        this.feedbacks = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  momentFormatL(date: any) {
    return moment(date).format('l');
  }
}
