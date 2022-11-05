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
  coreElectioModal: boolean = false
  electionPositionForm: FormGroup;

  currentDate: string;
  courses: any = [];
  students: any = [];
  electionId: number;
  election: any = [];
  tabItems: MenuItem[];
  activeItem: MenuItem;

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
  receipt: any = [];

  isPredictionsPanelOpen: boolean = false;
  chartData: any;
  chartOptions: any;

  predictionModal: boolean = false;
  isPredictionAvailable: boolean = false;
  positionTitle: any = '';
  hasSentiments: boolean = false;

  chartLoading: boolean = false;

  electionResult: any = [];
  winnersModal: boolean = false

  constructor(
    private courseService: CourseService,
    private electionService: ElectionService,
    private toast: HotToastService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((value) => {
      this.electionId = value.id;
    });

    this.currentDate = new Date().toISOString().slice(0, 16);

    this.getElection();
    this.getCourses();

    this.electionPositionForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      no_of_winners: new FormControl('', Validators.required),
      no_of_candidates: new FormControl('', Validators.required),
    });

    this.chartData = {
      labels: [],
      datasets: [
        {
          label: 'Positive',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          data: [],
        },
        {
          label: 'Negative',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          data: [],
        },

        {
          label: 'Neutral',
          backgroundColor: 'rgba(201, 203, 207, 0.2)',
          borderColor: 'rgba(201, 203, 207, 1)',
          borderWidth: 1,
          data: [],
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
    this.chartData.labels = [];
    this.chartData.datasets[0].data = [];
    this.chartData.datasets[1].data = [];
    this.chartData.datasets[2].data = [];

    this.positionTitle = position.title;
    this.predictionModal = true;

    if (new Date(this.election.campaignperiod_enddate) >= new Date()) {
      this.isPredictionAvailable = false;
      return;
    }

    this.isPredictionAvailable = true;
    this.chartLoading = true;

    this.electionService
      .getPrediction({
        ElectionId: this.election.id,
        ElectionPositionId: position.id,
      })
      .subscribe(
        (response: any) => {
          console.log(response);

          response.ElectionCandidates.forEach((candidate: any) => {
            if (candidate.Sentiments.length > 0) {
              this.hasSentiments = true;
            }
          });

          if (this.hasSentiments == false) {
            this.chartLoading = false;
            return;
          }

          response.ElectionCandidates.forEach(
            (candidate: any, canIndex: number) => {
              this.chartData.labels.push(candidate.User.name);

              const scores: any = {
                positive: 0,
                negative: 0,
                neutral: 0,
              };

              if (candidate.Sentiments.length != 0) {
                candidate.Sentiments.forEach((sentiment: any) => {
                  if (sentiment.score > 0) {
                    scores.positive = scores.positive + 1;
                  }

                  if (sentiment.score == 0) {
                    scores.neutral = scores.neutral + 1;
                  }

                  if (sentiment.score < 0) {
                    scores.negative = scores.negative + 1;
                  }
                });
              }

              let entries = Object.entries(scores);

              for (let [index, [key, value]] of entries.entries()) {
                this.chartData.datasets[index].data[canIndex] = value;
              }
            }
          );

          this.chartLoading = false;

          console.log(this.chartData);
        },
        (error: any) => { }
      );
  }

  getVoteReceipt(data: any) {
    this.electionService.getVoteReceipt(data).subscribe(
      (response: any) => {
        this.receipt = response;
        this.voteReceiptModal = true;
      },
      (error: any) => { }
    );
  }

  selectVoter(data: any) {
    this.getVoteReceipt({
      electionId: data.ElectionId,
      voterId: data.UserId,
    });
  }

  getResult() {
    let temp: any = [];

    this.election.ElectionPositions.forEach((position: any) => {
      const candidates = position.ElectionCandidates.sort((x: any, y: any) => {
        return y.ElectionVotes.length - x.ElectionVotes.length;
      });

      temp.push({
        positionId: position.id,
        title: position.title,
        noOfWinners: position.no_of_winners,
        candidateSortedByVoteCount: candidates,
      });
    });

    temp.forEach((item: any) => {
      let winners = item.candidateSortedByVoteCount.slice(0, item.noOfWinners);

      let result: any = [];

      winners.forEach((win: any) => {
        if (win.ElectionVotes.length == 0) {
          result.push({
            candidateId: win.id,
            name: win.User.name,
            result: 'loser',
          });

          return;
        }

        let bb = item.candidateSortedByVoteCount.reduce(
          (r: any, v: any, i: any) =>
            r.concat(
              v.ElectionVotes.length === win.ElectionVotes.length ? i : []
            ),
          []
        );

        if (bb.length == 1) {
          result.push({
            candidateId: win.id,
            name: win.User.name,
            result: 'winner',
          });
        } else {
          bb.forEach((b: any) => {
            let candi = item.candidateSortedByVoteCount[b];

            if (bb.length >= item.noOfWinners) {
              result.push({
                candidateId: candi.id,
                name: candi.User.name,
                result: 'draw',
              });
            } else {
              let dd = result.filter((res: any) => res.candidateId == candi.id);

              if (dd.length == 0) {
                result.push({
                  candidateId: candi.id,
                  name: candi.User.name,
                  result: 'winner',
                });
              }
            }
          });
        }
      });

      item.candidateSortedByVoteCount.forEach((a: any) => {
        let dd = result.filter((res: any) => res.candidateId == a.id);

        if (dd.length == 0) {
          result.push({
            candidateId: a.id,
            name: a.User.name,
            result: 'loser',
          });
        }
      });

      this.electionResult.push({
        positionId: item.positionId,
        title: item.title,
        noOfWinners: item.noOfWinners,
        results: result,
      });
    });

    console.log(this.electionResult);
  }

  checkResult(candidate: any) {
    let result = null;

    this.electionResult.forEach((pos: any) => {
      if (candidate.ElectionPositionId == pos.positionId) {
        pos.results.forEach((can: any) => {
          if (candidate.id == can.candidateId) {
            result = can.result;
          }
        });
      }
    });

    return result;
  }

  deleteElection() {
    this.electionService.deleteElection(this.election.id).subscribe(
      (response: any) => {
        this.toast.success(response.message);
        this.router.navigate(['/faculty/elections']);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  checkAddedPosition() {
    if (this.election.ElectionPositions.length == 0) {
      this.finishSetupPrompt = false;
      return this.toast.info(
        "There's no added election position.",
        { duration: 5000 }
      );
    }

    if (this.election.ElectionCandidates.length == 0) {
      this.finishSetupPrompt = false;
      return this.toast.info(
        "There's no added election candidate.",
        { duration: 5000 }
      );
    }

    this.coreElectioModal = true
  }

  finishSetup() {
    if (this.electionData.campaign.hasCampaign == null) {
      return this.toast.info('Please answer the questions to proceed.');
    }

    if (this.electionData.election.start == null) {
      return this.toast.info('Please input election start date.');
    }

    if (this.electionData.election.end == null) {
      return this.toast.info('Please input election end date.');
    }

    const ans = confirm("Finish Setup? Are you sure?")

    if(!ans) return

    this.electionService
      .changeStatus({
        core: { ...this.electionData },
        ElectionId: this.election.id,
        status: 'active',

      })
      .subscribe(
        (response: any) => {
          this.toast.success(response.message);

          this.getElection();
          this.coreElectioModal = false;

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
    this.electionPositionId = data.id;
    this.limitOfCandidates = data.no_of_candidates;
    this.candidatesModal = true;

    this.candidates = data.ElectionCandidates;
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
        this.toast.success(response.message);
        this.getElection();
        this.submitLoading = false;
        this.electionPositionModal = false;
        this.electionPositionForm.reset();
      },
      (error: any) => {
        this.submitLoading = false;
        this.toast.error(error.error.message);
      }
    );
  }

  candidatesTrack(item: any, index: any) {
    return `${item.id}-${index}`;
  }

  getSentiments() {
    const data: any = {
      ElectionId: this.election.id,
    };

    this.electionService.getSentiments(data).subscribe(
      (response: any) => {
        // console.log(response);
      },
      (error: any) => {
        this.submitLoading = false;
      }
    );
  }

  getElection() {
    this.candidates = [];

    this.electionService.getElection(this.electionId).subscribe(
      (response: any) => {
        this.election = response;

        this.getStudents();
        this.getElectionEvent();
        this.getResult();

        if (this.electionPositionId) {
          response.ElectionPositions.forEach((position: any) => {
            if (this.electionPositionId == position.id) {
              position.ElectionCandidates.forEach((el: any) => {
                this.candidates.push(el);
              });
            }
          });
        }

        if (response.hasCampaign == true) {
          if (new Date(response.campaignperiod_enddate) <= new Date()) {
            this.getSentiments();
          }
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
      UserId: this.addCandidateData.UserId,
      ElectionPositionId: this.electionPositionId,
      ElectionId: this.electionId,
    };

    this.electionService.addCandidate(data).subscribe(
      (response: any) => {
        this.toast.success(response.message);
        this.submitLoading = false;
        this.addCandidateModal = false;
        this.getElection();

        console.log(response);

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
            this.toast.success(response.message);
            this.getElection();
          },
          (error: any) => { }
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
            this.toast.success(response.message);
            this.getElection();
          },
          (error: any) => { }
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
