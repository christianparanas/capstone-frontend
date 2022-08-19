import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';

import { CourseService } from 'src/app/core/shared/services/course.service';

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.scss'],
})
export class ElectionComponent implements OnInit {
  submitLoading: boolean = false;
  createElectionModal: boolean = true;
  electionForm: FormGroup;
  nextPanel: boolean = false

  courses: any;

  constructor(
    private courseService: CourseService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.getCourses();

    this.electionForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      course: new FormControl('', Validators.required),
      section: new FormControl('', Validators.required),
      year: new FormControl('', Validators.required),
    });
  }

  createElection() {
    
  }

  onSubmit() {
    if (!this.electionForm.valid) {
      this.toast.info('Please fill out all the fields.', {
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
}
