import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';

import { CourseService } from 'src/app/core/shared/services/course.service';
import { ElectionService } from '../../shared/services/election.service';
import { EventService } from '../../shared/services/event.service';

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.scss'],
})
export class ElectionComponent implements OnInit {
  isLoading: boolean = true;
  submitLoading: boolean = false;
  candidateModal: boolean = false

  currentDate: string;
  courses: any;
  electionId: number;
  election: any = [];
  candidate: any = []

  constructor(
    private courseService: CourseService,
    private electionService: ElectionService,
    private toast: HotToastService,
    private location: Location,
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((value) => {
      this.electionId = value.id;
    });

    this.getElection();
    this.getCourses();
    this.getElectionEvent()
  }

  getElectionEvent() {
    this.eventService.getElectionEvent().subscribe((response: any) => {
      if (response.electionId == this.election.id) {
        this.getElection()
      }
    });
  }

  getElection() {
    this.electionService.getElection(this.electionId).subscribe(
      (response: any) => {
        this.election = response;
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
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

  openCandidateModal(candidate: any) {
    this.candidate = candidate

    console.log(candidate)

    this.candidateModal = true
  }

  goBack(): void {
    this.location.back();
  }

  dateFormat(date: any) {
    return moment(date).calendar();
  }
}
