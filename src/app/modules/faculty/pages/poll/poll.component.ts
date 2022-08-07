import { Component, OnInit } from '@angular/core';

import { CourseService } from 'src/app/core/shared/services/course.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss'],
})
export class PollComponent implements OnInit {
  createPollModal: boolean = false;
  courses: any;
  currentDate: string;
  nextPanel: boolean = false;
  submitLoading: false;

  pollData: any;

  constructor(private courseService: CourseService) {
    this.pollData = {
      question: '',
      options: [{ content: 'option1' }, { content: 'option2' }],
    };
  }

  ngOnInit(): void {
    this.currentDate = new Date().toISOString().slice(0, 16);
    this.getCourses();
  }

  addAnotherOption() {
    this.pollData.options.push({
      content: '',
    });
  }

  openNextPanel() {
    this.nextPanel = true;
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
