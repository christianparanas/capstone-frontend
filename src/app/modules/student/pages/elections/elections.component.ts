import { Component, OnInit } from '@angular/core';

import { ElectionService } from '../../shared/services/election.service';
import { ProfileService } from '../../shared/services/profile.service';
import { CourseService } from 'src/app/core/shared/services/course.service';
import { EventService } from '../../shared/services/event.service'
import * as moment from 'moment';

@Component({
  selector: 'app-elections',
  templateUrl: './elections.component.html',
  styleUrls: ['./elections.component.scss'],
})
export class ElectionsComponent implements OnInit {
  elections: any = [];
  user: any = [];
  courses: any = []

  isLoading: boolean = true

  constructor(
    private electionService: ElectionService,
    private profileService: ProfileService,
    private courseService: CourseService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.getUser()
    this.getCourses()
    this.getElectionEvent()
  }

  getElectionEvent() {
    this.eventService.getNewElectionEvent().subscribe((response: any) => {
      if (
        (response.course == this.user.StudentCredential.CourseId ||
          response.course == '0') &&
        (response.section == this.user.StudentCredential.section ||
          response.section == '0') &&
        (response.year == this.user.StudentCredential.year ||
          response.year == '0')
      ) {
        this.getElections();
      }
    });
  }

  getElections() {
    const data = {
      section: this.user.StudentCredential.section,
      year: this.user.StudentCredential.year,
      CourseId: this.user.StudentCredential.CourseId,
    };

    this.electionService.getElections(data).subscribe(
      (response: any) => {
        this.elections = response
        this.isLoading = false

        console.log(response)
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
        this.getElections();
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
        courseTitle = course.acronym;
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
    return moment(date).calendar();
  }
}
