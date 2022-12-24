import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Router, ActivatedRoute } from '@angular/router';

import { ElectionService } from '../../shared/services/election.service';
import { CourseService } from 'src/app/core/shared/services/course.service';
import { EventService } from '../../shared/services/event.service';
import { ProfileService } from '../../shared/services/profile.service';

@Component({
  selector: 'app-elections',
  templateUrl: './elections.component.html',
  styleUrls: ['./elections.component.scss'],
})
export class ElectionsComponent implements OnInit {
  elections: any = [];
  courses: any = [];

  isLoading: boolean = true;
  state: any = 'all';
  tempElectionsArr: any = [];

  // create election
  createElectionModal: boolean = false
  submitLoading: boolean = false;
  electionForm: FormGroup;

  electionData: any = {
    campaign: {
      hasCampaign: null,
      start: null,
      end: null,
    },
    election: {
      start: null,
      end: null,
    },
  };

  profile: any = []

  constructor(
    private electionService: ElectionService,
    private courseService: CourseService,
    private eventService: EventService,
    private toast: HotToastService,
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.getProfile()
    this.getCourses();
    this.getElections();

    this.getElectionsEvent();

    this.electionForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      course: new FormControl(''),
      section: new FormControl('', Validators.required),
      year: new FormControl('', Validators.required),
    });
  }

  getProfile() {
    this.profileService.getProfile().subscribe((response: any) => {
      this.profile = response
    })
  }

  getElectionsEvent() {
    this.eventService.getElectionEvent().subscribe((response: any) => {
      this.getElections();
    });
  }

  getElectionByState() {
    this.tempElectionsArr = this.elections.filter((item: any) => {
      if (this.state == 'all') return true;
      if (this.state == 'draft') return item.status == 'draft';
      if (this.state == 'ongoing') return item.stage == 'election_started';
      if (this.state == 'ended') return item.stage == 'election_ended';
      if (this.state == 'own') return item.UserId == this.profile.id;
    });
  }

  createElection() {
    const data: any = {
      ...this.electionForm.value,

    };

    this.electionService.addElection(data).subscribe(
      (response: any) => {
        this.submitLoading = false;
        this.toast.success(response.message);
        this.createElectionModal = false;
        this.electionForm.reset();

        this.router.navigate([`/admin/election`], {
          queryParams: { id: response.electionId },
        });
      },
      (error: any) => {
        console.log(error);
        this.submitLoading = false;
      }
    );
  }

  onSubmit() {
    if (!this.electionForm.valid) {
      this.toast.info('Please fill out all the fields.');
      return;
    }

    this.submitLoading = true
    this.createElection()
  }

  getElections() {
    this.electionService.getElections().subscribe(
      (response: any) => {
        this.elections = response;

        this.getElectionByState();
        this.isLoading = false;
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
        courseTitle = course.title;
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
    return moment(date).format('lll');
  }
}
