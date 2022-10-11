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
  electionPositionModal: boolean = false;
  addCandidateModal: boolean = false;
  candidatesModal: boolean = false;
  votersModal: boolean = false;
  finishSetupPrompt: boolean = false;
  deleteElectionPrompt: boolean = false;
  voteReceiptModal: boolean = false;
  electionPositionForm: FormGroup;

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

    this.electionPositionForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      no_of_winners: new FormControl('', Validators.required),
      no_of_candidates: new FormControl('', Validators.required),
    });

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

  getPrediction(position: any) {
    this.predictionModal = true; 

    const data: any = {
      ElectionId: position.ElectionId,
      ElectionPositionId: position.id,
      candidates: []
    }

    position.ElectionCandidates.forEach((candidate: any) => {
      data.candidates.push({
        UserId: candidate.id,
        messages: candidate.User.username
      })
    })

    this.electionService.getPrediction(data).subscribe(
      (response: any) => {
        console.log(response)
      },
      (error: any) => {}
    );
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

  deleteElection() {
    this.electionService.deleteElection(this.election.id).subscribe(
      (response: any) => {
        this.toast.success(response.message, { position: 'top-right' });
        this.router.navigate(['/faculty/elections']);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  finishSetup() {
    if (this.election.ElectionPositions.length == 0) {
      this.finishSetupPrompt = false;
      return this.toast.info(
        "There's no added election position. Please provide, or else this election cannot be accepted",
        { position: 'top-right', duration: 5000 }
      );
    }

    this.electionService
      .changeStatus({
        ElectionId: this.election.id,
        status: 'active',
        stage: this.election.hasCampaign
          ? this.election.campaignperiod_startdate <= new Date()
            ? 'campaign'
            : 'initial'
          : this.election.election_startdate <= new Date()
          ? 'election'
          : 'initial',
      })
      .subscribe(
        (response: any) => {
          this.toast.success(response.message, { position: 'top-right' });

          this.getElection();
          this.finishSetupPrompt = false;

          this.eventService.sendNewElectionEvent({
            course: this.election.course,
            section: this.election.section,
            year: this.election.year,
          });
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  changeTab(tab: any) {
    if (tab.activeItem.label == 'Candidates') {
      this.activeItem = this.tabItems[0];
    } else {
      this.activeItem = this.tabItems[1];
    }
  }

  positionModal(data: any) {
    this.candidates = [];
    this.electionPositionId = data.id;
    this.limitOfCandidates = data.no_of_candidates;
    this.candidatesModal = true;

    data.ElectionCandidates.forEach((el: any) => {
      this.candidates.push(el);
    });
  }

  onElectionPositionSubmit() {
    if (!this.electionPositionForm.valid) {
      return this.toast.info('Please fill out all the input fields', {
        position: 'top-right',
      });
    }

    this.submitLoading = true;

    const data = {
      ...this.electionPositionForm.value,
      ElectionId: this.electionId,
    };

    this.electionService.addElectionPosition(data).subscribe(
      (response: any) => {
        this.toast.success(response.message, { position: 'top-right' });
        this.getElection();
        this.submitLoading = false;
        this.electionPositionModal = false;
        this.electionPositionForm.reset();
      },
      (error: any) => {
        this.submitLoading = false;
        this.toast.error(error.error.message, { position: 'top-right' });
      }
    );
  }

  candidatesTrack(item: any, index: any) {
    return `${item.id}-${index}`;
  }

  getElection() {
    this.candidates = [];

    this.electionService.getElection(this.electionId).subscribe(
      (response: any) => {
        this.election = response;

        this.getStudents();
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

  getStudents() {
    this.electionService
      .getStudentAccounts({
        course: this.election.course,
        section: this.election.section,
        year: this.election.year,
      })
      .subscribe(
        (response: any) => {
          this.students = response;

          console.log(response)
        },
        (error: any) => {
          console.log(error);
        }
      );
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

  onAddCandidateSubmit() {
    if (this.addCandidateData.platform == null) {
      return this.toast.info('Please write platform');
    }

    if (this.addCandidateData.UserId == null) {
      return this.toast.info('Please select a candidate');
    }

    this.submitLoading = true;

    const data: any = {
      image: this.addCandidateData.image,
      platform: this.addCandidateData.platform,
      status: 'approved',
      UserId: this.addCandidateData.UserId,
      ElectionPositionId: this.electionPositionId,
      ElectionId: this.electionId,
    };

    this.electionService.addCandidate(data).subscribe(
      (response: any) => {
        this.toast.success(response.message, { position: 'top-right' });
        this.submitLoading = false;
        this.addCandidateModal = false;
        this.getElection();

        this.addCandidateData = {
          image: null,
          platform: null,
          UserId: null,
        };
      },
      (error: any) => {
        console.log(error);
        this.toast.error(error.error.message, { duration: 5000 });
        this.submitLoading = false;

        this.addCandidateData = {
          platform: null,
          UserId: null,
        };
      }
    );
  }

  removePosition(data: any) {
    let ans = confirm('Are you sure you want to remove this position?');

    if (ans) {
      this.electionService
        .deletePosition({
          electionId: data.ElectionId,
          electionPositionId: data.id,
        })
        .subscribe(
          (response: any) => {
            this.toast.success(response.message, { position: 'top-right' });
            this.getElection();
          },
          (error: any) => {}
        );
    }
  }

  removeCandidate(data: any) {
    let ans = confirm('Are you sure you want to remove this candidate?');

    if (ans) {
      this.electionService
        .deleteCandidate({
          electionId: data.ElectionId,
          electionPositionId: data.ElectionPositionId,
          electionCandidateId: data.id,
        })
        .subscribe(
          (response: any) => {
            this.toast.success(response.message, { position: 'top-right' });
            this.getElection();
          },
          (error: any) => {}
        );
    }
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
