import { Component, OnInit } from '@angular/core';

import { CourseService } from 'src/app/core/shared/services/course.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss']
})
export class PollComponent implements OnInit {
  createPollModal: boolean = true
  courses: any

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.getCourses()
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
