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
  nextPanel: boolean = true;

  currentDate: string
  courses: any;

  electionData: any = {
    coc: {
      hasCOCFiling: null,
      start: null,
      end: null,
    },
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

  constructor(
    private courseService: CourseService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.currentDate = new Date().toISOString().slice(0, 16);
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
    if(this.electionData.coc.hasCOCFiling == null || this.electionData.campaign.hasCampaign == null) {
      return this.toast.info("Please answer the questions to proceed.", { position: "top-right" })
    }

    if(this.electionData.election.start == null) {
      return this.toast.info("Please input election start date.", { position: "top-right" })
    }
    
    if(this.electionData.election.end == null) {
      return this.toast.info("Please input election end date.", { position: "top-right" })
    }

    const data: any = {
      ...this.electionForm.value,
      dates: { ...this.electionData },
    };
    console.log(data);
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
