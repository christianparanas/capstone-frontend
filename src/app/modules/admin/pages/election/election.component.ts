import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { ElectionService } from '../../shared/services/election.service';
import { CourseService } from 'src/app/core/shared/services/course.service';

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.scss']
})
export class ElectionComponent implements OnInit {
  elections: any = []
  courses: any = []

  isLoading: boolean = true

  constructor(private electionService: ElectionService, private courseService: CourseService) { }

  ngOnInit(): void {
    this.getCourses()
    this.getElections()
  }

  getElections() {
    this.electionService.getElections().subscribe(
      (response: any) => {
        this.elections = response
        this.isLoading = false
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
