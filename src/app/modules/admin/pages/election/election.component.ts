import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';
import { MenuItem } from 'primeng/api';

import { CourseService } from 'src/app/core/shared/services/course.service';
import { ElectionService } from '../../shared/services/election.service';

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.scss'],
})
export class ElectionComponent implements OnInit {
  isLoading: boolean = true;
  submitLoading: boolean = false;
  candidatesModal: boolean = false;
  electionPositionForm: FormGroup;

  currentDate: string;
  courses: any;
  electionId: number;
  election: any = [];
  tabItems: MenuItem[];
  activeItem: MenuItem;

  electionPositionId: any = null;

  candidatesModalData: any = {
    approved_candidates: [],
    rejected_candidates: [],
    applications: [],
  };

  constructor(
    private courseService: CourseService,
    private electionService: ElectionService,
    private toast: HotToastService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((value) => {
      this.electionId = value.id;
    });

    this.getElection();
    this.getCourses();
  }



  changeTab(tab: any) {
    if (tab.activeItem.label == 'Candidates') {
      this.activeItem = this.tabItems[0];
    } else {
      this.activeItem = this.tabItems[1];
    }
  }

  positionModal(data: any) {
    this.candidatesModalData = {
      approved_candidates: [],
      rejected_candidates: [],
      applications: [],
    };

    this.electionPositionId = data.id;

    this.candidatesModal = true;

    data.ElectionCandidates.forEach((el: any) => {
      if (el.status == 'pending') {
        this.candidatesModalData.applications.push(el);
      } else if (el.status == 'approved') {
        this.candidatesModalData.approved_candidates.push(el);
      } else {
        this.candidatesModalData.rejected_candidates.push(el);
      }
    });
  }

  candidatesTrack(item: any, index: any) {
    return `${item.id}-${index}`;
  }

  getElection() {
    this.candidatesModalData = {
      approved_candidates: [],
      rejected_candidates: [],
      applications: [],
    };

    this.electionService.getElection(this.electionId).subscribe(
      (response: any) => {
        console.log(response);
        this.election = response;

        if (this.electionPositionId) {
          response.ElectionPositions.forEach((position: any) => {
            if (this.electionPositionId == position.id) {
              position.ElectionCandidates.forEach((candidate: any) => {
                if (candidate.status == 'pending') {
                  this.candidatesModalData.applications.push(candidate);
                } else if (candidate.status == 'approved') {
                  this.candidatesModalData.approved_candidates.push(candidate);
                } else {
                  this.candidatesModalData.rejected_candidates.push(candidate);
                }
              });
            }
          });
        }

        this.isLoading = false;

        if (this.election.hasCOCFiling == true) {
          this.tabItems = [
            { label: 'Candidates', icon: 'pi pi-fw pi-home' },
            { label: 'Applications', icon: 'pi pi-fw pi-home' },
          ];
        } else {
          this.tabItems = [{ label: 'Candidates', icon: 'pi pi-fw pi-home' }];
        }

        this.activeItem = this.tabItems[0];
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

  goBack(): void {
    this.location.back();
  }

  dateFormat(date: any) {
    return moment(date).calendar();
  }


}
