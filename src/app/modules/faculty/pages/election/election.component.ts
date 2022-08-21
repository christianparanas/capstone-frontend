import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';

import { CourseService } from 'src/app/core/shared/services/course.service';
import { ElectionService } from '../../shared/services/election.service';

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.scss'],
})
export class ElectionComponent implements OnInit {
  submitLoading: boolean = false;
  createElectionModal: boolean = true;
  electionForm: FormGroup;
  nextPanel: boolean = false;

  currentDate: string;
  courses: any;


  constructor(
    private courseService: CourseService,
    private electionService: ElectionService,
    private toast: HotToastService,
    private location: Location
  ) {}

  ngOnInit(): void {

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

  goBack(): void {
    this.location.back();
  }
}
