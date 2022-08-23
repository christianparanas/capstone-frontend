import { Component, OnInit } from '@angular/core';

import { ElectionService } from '../../shared/services/election.service';
import { ProfileService } from '../../shared/services/profile.service';
import { CourseService } from 'src/app/core/shared/services/course.service';
import * as moment from 'moment';

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.scss'],
})
export class ElectionComponent implements OnInit {
  elections: any = [];
  user: any = [];
  courses: any = []

  isLoading: boolean = true

  constructor(
    private electionService: ElectionService,
    private profileService: ProfileService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.getUser()
    this.getCourses()
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
