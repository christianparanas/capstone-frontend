import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { VotereceiptsService } from '../../shared/services/votereceipts.service';
import { CourseService } from 'src/app/core/shared/services/course.service';
import { ProfileService } from '../../shared/services/profile.service';
import * as moment from 'moment';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss'],
})
export class ReceiptsComponent implements OnInit {
  receipts: any = [];
  profile: any = [];
  isLoading: boolean = true

  courses: any = []

  constructor(
    private votereceiptsService: VotereceiptsService,
    private courseService: CourseService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.getVoteReceipts();
    this.getCourses()
    this.getProfile()
  }

  getProfile() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.profile = response;
      },
      (error: any) => {
      }
    );
  }

  getVoteReceipts() {
    this.votereceiptsService.getVoteReceipts().subscribe(
      (response: any) => {
        this.receipts = response;
        this.isLoading = false
      },
      (error: any) => {
        this.isLoading = false
      }
    );
  }

  dateFormat(date: any) {
    return moment(date).format('lll');
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
}
