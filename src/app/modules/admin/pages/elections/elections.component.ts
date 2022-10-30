import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { ElectionService } from '../../shared/services/election.service';
import { CourseService } from 'src/app/core/shared/services/course.service';
import { EventService } from '../../shared/services/event.service';

@Component({
  selector: 'app-elections',
  templateUrl: './elections.component.html',
  styleUrls: ['./elections.component.scss'],
})
export class ElectionsComponent implements OnInit {
  elections: any = [];
  courses: any = [];

  isLoading: boolean = true;
  state: any = 'all';
  tempElectionsArr: any = [];

  constructor(
    private electionService: ElectionService,
    private courseService: CourseService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.getCourses();
    this.getElections();

    this.getElectionsEvent();
  }

  getElectionsEvent() {
    this.eventService.getElectionEvent().subscribe((response: any) => {
      this.getElections();
    });
  }

  getElectionByState() {
    this.tempElectionsArr = this.elections.filter((item: any) => {
      if (this.state == 'all') return true;
      if (this.state == 'draft') return item.status == 'draft';
      if (this.state == 'ongoing') return item.stage == 'election_started';
      if (this.state == 'ended') return item.stage == 'election_ended';
    });
  }

  getElections() {
    this.electionService.getElections().subscribe(
      (response: any) => {
        this.elections = response;

        this.getElectionByState();
        this.isLoading = false;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getCourse(CourseId: any) {
    let courseTitle = null;

    this.courses.forEach((course: any) => {
      if (course.id == CourseId) {
        courseTitle = course.title;
      }
    });

    return courseTitle;
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
