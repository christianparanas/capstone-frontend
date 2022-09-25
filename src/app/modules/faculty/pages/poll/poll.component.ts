import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';

import { CourseService } from 'src/app/core/shared/services/course.service';
import { PollService } from '../../shared/services/poll.service';
import { EventService } from '../../shared/services/event.service';
import { ProfileService } from '../../shared/services/profile.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss'],
})
export class PollComponent implements OnInit {
  createPollModal: boolean = false;
  courses: any;
  polls: any;
  currentDate: string;
  nextPanel: boolean = false;
  submitLoading: boolean = false;
  pollForm: FormGroup;
  pollData: any;
  user: any;
  isLoading: boolean = true;

  constructor(
    private courseService: CourseService,
    private toast: HotToastService,
    private pollService: PollService,
    private eventService: EventService,
    private profileService: ProfileService
  ) {
    this.pollData = {
      question: '',
      options: [{ content: '' }, { content: '' }],
    };
  }

  ngOnInit(): void {
    this.currentDate = new Date().toISOString().slice(0, 16);
    this.getCourses();
    this.getPolls();

    this.pollForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      course: new FormControl('', Validators.required),
      section: new FormControl('', Validators.required),
      year: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
    });

    this.getUser();
  }

  getPollEvent() {
    this.eventService.getPollEvent().subscribe((response: any) => {
      if (response.UserId == this.user.id) {
        this.getPolls();
      }
    });
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

  getUser() {
    this.profileService.getProfile().subscribe(
      async (response: any) => {
        this.user = await response;
        this.getPollEvent();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getPolls() {
    this.pollService.getPolls().subscribe(
      (response: any) => {
        this.polls = response;

        this.isLoading = false;
        console.log(response)
      },
      (error: any) => {}
    );
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
    let isEmpty;

    console.log(this.pollForm.value)

    this.pollData.options.forEach((option: any) => {
      if (option.content == '') {
        isEmpty = true;
      }
    });

    if (this.pollData.question == '' || isEmpty) {
      this.toast.info('Please fill out the fields.', { position: 'top-right' });
      return;
    }

    const data: any = {
      ...this.pollForm.value,
      polldata: this.pollData,
    };

    this.submitLoading = true;

    this.pollService.addPoll(data).subscribe(
      (response: any) => {
        this.toast.success(response.message, { position: 'top-right' });
        this.submitLoading = false;
        this.createPollModal = false;

        const data = {
          course: this.pollForm.value.course,
          section: this.pollForm.value.section,
          year: this.pollForm.value.year,
        };

        this.eventService.sendNewPollEvent(data);

        this.getPolls();

        this.pollData = {
          question: '',
          options: [{ content: '' }, { content: '' }],
        };
        this.nextPanel = false;

        this.pollForm.reset();
      },
      (error: any) => {
        this.toast.error(error.error.message, { position: 'top-right' });
        this.submitLoading = false;
      }
    );
  }

  onSubmit() {
    if (!this.pollForm.valid) {
      this.toast.info('Please fill out the fields with valid data.', {
        position: 'top-right',
      });
      return;
    }

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

  dateFormat(date: any) {
    return moment(date).calendar();
  }
}
