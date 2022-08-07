import { Component, OnInit } from '@angular/core';

import { CourseService } from 'src/app/core/shared/services/course.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss']
})
export class PollComponent implements OnInit {
  createPollModal: boolean = false
  courses: any
  currentDate: string
  nextPanel: boolean = false
  submitLoading: false

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.currentDate = new Date().toISOString().slice(0, 16);

    console.log(new Date().toISOString().slice(0, 16))

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
