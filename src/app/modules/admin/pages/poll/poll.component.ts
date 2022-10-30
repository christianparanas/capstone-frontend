import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';

import { EventService } from '../../shared/services/event.service';
import { PollService } from '../../shared/services/poll.service';
import { CourseService } from 'src/app/core/shared/services/course.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss'],
})
export class PollComponent implements OnInit {
  courses: any;
  polls: any;
  currentDate: string;
  isLoading: boolean = true;

  tempPollsArr: any = []
  state: any = "all"
  
  constructor(
    private courseService: CourseService,
    private toast: HotToastService,
    private pollService: PollService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.getPolls();
    this.getCourses();
    this.getPollEvent();
  }

  getCourse(courseId: any) {
    let courseTitle = null

    this.courses.forEach((course: any) => {
      if(course.id == courseId) {
        courseTitle = course.title
      }
    });

    return courseTitle
  }

  getPollEvent() {
    this.eventService.getPollEvent().subscribe((response: any) => {
      this.getPolls();
    });
  }

  getPolls() {
    this.pollService.getPolls(0).subscribe(
      (response: any) => {
        this.polls = response;
        this.getPollsByState()

        this.isLoading = false;
      },
      (error: any) => {}
    );
  }

  getPollsByState() {
    this.tempPollsArr = this.polls.filter((item: any) => {
      if (this.state == 'all') return true;
      if (this.state == 'active') return item.published == true;
      if (this.state == 'inactive') return item.published == false;
    });
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

  dateFormat(date: any) {
    return moment(date).format('lll');
  }
}
