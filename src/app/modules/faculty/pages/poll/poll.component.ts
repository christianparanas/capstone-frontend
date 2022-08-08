import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';

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
  submitLoading: boolean = false;
  pollForm: FormGroup;

  pollData: any;

  constructor(private courseService: CourseService, private toast: HotToastService) {
    this.pollData = {
      question: '',
      options: [{ content: '' }, { content: '' }],
    };
  }

  ngOnInit(): void {
    this.currentDate = new Date().toISOString().slice(0, 16);
    this.getCourses();

    this.pollForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      allowedCourse: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
    });
  }

  addAnotherOption() {
    this.pollData.options.push({
      content: '',
    });
  }

  removeOption(index: any) {
    this.pollData.options.splice(index, 1);
  }

  submitPoll() {
    let isEmpty

    this.pollData.options.forEach((option: any) => {
      if(option.content == "") {
        isEmpty = true
      }
    });

    if(this.pollData.question == "" || isEmpty) {
      this.toast.info("Please fill out the fields.", { position: "top-right" })
      return
    }

    const data: any = {
      ...this.pollForm.value,
      polldata: this.pollData
    }

    console.log(data)

    this.submitLoading = true
  }

  onSubmit() {
    if(!this.pollForm.valid) {
      this.toast.info("Please fill out the fields with valid data.", { position: "top-right" })
      return
    }

    this.nextPanel = true
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
