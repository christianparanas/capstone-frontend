import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';
import { MenuItem } from 'primeng/api';

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

  votersModal: boolean = false;
  voteReceiptModal: boolean = false;

  currentDate: string;
  courses: any = [];
  students: any = [];
  electionId: number;
  election: any = [];
  tabItems: MenuItem[];
  activeItem: MenuItem;

  electionPositionId: any = null;
  addCandidatePreviewImg: any = null;
  addCandidateData: any = {
    image: null,
    platform: null,
    UserId: null,
  };
  candidates: any = [];
  limitOfCandidates: any;
  winners: any = [];
  receipt: any = []

  isPredictionsPanelOpen: boolean = false;
  chartData: any;
  chartOptions: any;

  predictionModal: boolean = false

  constructor(
    private courseService: CourseService,
    private electionService: ElectionService,
    private toast: HotToastService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((value) => {
      this.electionId = value.id;
    });

    this.getElection();
    this.getCourses();

    this.chartData = {
      labels: ['Christian', 'Luigi', 'Shiela'],
      datasets: [
        {
          label: 'Positive',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          data: [25, 30, 15],
        },
        {
          label: 'Negative',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          data: [2, 14, 5],
        },

        {
          label: 'Neutral',
          backgroundColor: 'rgba(201, 203, 207, 0.2)',
          borderColor: 'rgba(201, 203, 207, 1)',
          borderWidth: 1,
          data: [5, 12, 10],
        },
      ],
    };

    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#000',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#000',
          },
          grid: {
            color: 'rgba(255,255,255,0.2)',
          },
        },
        y: {
          ticks: {
            color: '#000',
          },
          grid: {
            color: 'rgba(255,255,255,0.2)',
          },
        },
      },
    };
  }

  getElectionEvent() {
    this.eventService.getElectionEvent().subscribe((response: any) => {
      if (response.electionId == this.election.id) {
        this.getElection();
      }
    });
  }

  getVoteReceipt(data: any) {
    this.electionService.getVoteReceipt(data).subscribe(
      (response: any) => {
        this.receipt = response;
        this.voteReceiptModal = true;
      },
      (error: any) => {}
    );
  }

  selectVoter(data: any) {
    this.getVoteReceipt({
      electionId: data.ElectionId,
      voterId: data.UserId
    });
  }

  getWinners() {
    this.election.ElectionPositions.forEach((position: any) => {
      const winner = position.ElectionCandidates.sort((x: any, y: any) => {
        return y.ElectionVotes.length - x.ElectionVotes.length;
      }).slice(0, position.no_of_winners);

      this.winners.push(winner);
    });
  }

  checkIfWinner(candidate: any) {
    let isWinner = null;

    this.winners.forEach((winner: any) => {
      winner.forEach((win: any) => {
        if (
          win.ElectionPositionId == candidate.ElectionPositionId &&
          win.id == candidate.id
        ) {
          isWinner = true;
        }
      });
    });

    return isWinner;
  }



  getElection() {
    this.candidates = [];

    this.electionService.getElection(this.electionId).subscribe(
      (response: any) => {
        this.election = response;

        this.getElectionEvent();
        this.getWinners();

        if (this.electionPositionId) {
          response.ElectionPositions.forEach((position: any) => {
            if (this.electionPositionId == position.id) {
              position.ElectionCandidates.forEach((el: any) => {
                this.candidates.push(el);
              });
            }
          });
        }

        this.isLoading = false;
        this.tabItems = [{ label: 'Candidates', icon: 'pi pi-fw pi-home' }];
        this.activeItem = this.tabItems[0];
      },
      (error: any) => {
        this.isLoading = false;
      }
    );
  }

  getCourse(CourseId: any) {
    let courseTitle = null;

    if (this.courses.length != 0) {
      this.courses.forEach((course: any) => {
        if (course.id == CourseId) {
          courseTitle = course.title;
        }
      });
    }

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


  loadInputImgToSrc(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = () => {
      this.addCandidatePreviewImg = reader.result;
      this.addCandidateData.image = reader.result;
    };
  }
}
