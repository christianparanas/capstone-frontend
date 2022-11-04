import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';

import { CourseService } from 'src/app/core/shared/services/course.service';
import { ElectionService } from '../../shared/services/election.service';
import { ProfileService } from '../../shared/services/profile.service';
import { EventService } from '../../shared/services/event.service';

@Component({
  selector: 'app-elections',
  templateUrl: './elections.component.html',
  styleUrls: ['./elections.component.scss'],
})
export class ElectionsComponent implements OnInit {
  submitLoading: boolean = false;
  createElectionModal: boolean = false;
  electionForm: FormGroup;
  nextPanel: boolean = false;
  isLoading: boolean = true;

  currentDate: string;
  courses: any = [];
  elections: any = [];

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

  state: any = 'all';
  tempElectionsArr: any = [];

  user: any = [];

  constructor(
    private profileService: ProfileService,
    private courseService: CourseService,
    private electionService: ElectionService,
    private toast: HotToastService,
    private router: Router,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.currentDate = new Date().toISOString().slice(0, 16);
    this.getElections();
    this.getCourses();
    this.getProfile();

    this.getElectionsEvent()

    this.electionForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      course: new FormControl(''),
      section: new FormControl('', Validators.required),
      year: new FormControl('', Validators.required),
    });
  }

  getElectionsEvent() {
    this.eventService.getElectionEvent().subscribe((response: any) => {
      this.getElections();
    });
  }

  getProfile() {
    this.profileService.getProfile().subscribe((response: any) => {
      this.user = response;
    });
  }

  createElection() {
    const data: any = {
      ...this.electionForm.value,

    };

    this.submitLoading = true;

    this.electionService.addElection(data).subscribe(
      (response: any) => {
        this.submitLoading = false;
        this.toast.success(response.message);
        this.createElectionModal = false;
        this.electionForm.reset();

        this.router.navigate([`/faculty/election`], {
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
      this.toast.info('Please fill out all the fields.', {
        position: 'top-right',
      });
      return;
    }

    if (this.electionForm.value.course == '') {
      this.electionForm.value.course = this.user.coverage;
    }

    this.createElection()
  }

  getElectionByState() {
    this.tempElectionsArr = this.elections.filter((item: any) => {
      if (this.state == 'all') return true;
      if (this.state == 'draft') return item.status == 'draft';
      if (this.state == 'ongoing') return item.stage == 'election_started';
      if (this.state == 'ended') return item.stage == 'election_ended';
    });
  }

  getElections() {
    this.electionService.getElections().subscribe(
      (response: any) => {
        this.elections = response;
        this.getElectionByState()
        this.isLoading = false;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getCourse(CourseId: any) {
    let courseTitle = null;

    if (this.courses.length == 0) return

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
