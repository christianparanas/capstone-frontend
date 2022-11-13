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
import { PdfService } from 'src/app/core/shared/services/pdf.service';

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
  electionResult: any = [];
  receipt: any = [];

  isPredictionsPanelOpen: boolean = false;
  chartData: any;
  chartOptions: any;

  predictionModal: boolean = false;
  isPredictionAvailable: boolean = false
  positionTitle: any = ""
  hasSentiments: boolean = false

  chartLoading: boolean = false
  winnersModal: boolean = false

  constructor(
    private courseService: CourseService,
    private electionService: ElectionService,
    private toast: HotToastService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((value) => {
      this.electionId = value.id;
    });

    this.getElection();
    this.getCourses();

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

  downloadPdf() {
    this.pdfService.downloadPDF(this.election.id, `${this.election.title}-winners`)
  }

  byCourseArr(candidates: any) {
    let arr: any = [];

    candidates.forEach((candi: any) => {
      let id = candi.User.StudentCredential.CourseId;

      let bb = null;

      if (arr.length >= 1) {
        arr.forEach((item: any, idx: any) => {
          if (id == item.course) {
            arr[idx].candidates.push(candi);
          } else {
            bb = true;
          }
        });

        if (bb && undefined == arr.find((item: any) => item.course == id)) {
          arr.push({
            course: candi.User.StudentCredential.CourseId,
            candidates: [candi],
          });
        }
      } else {
        arr.push({
          course: candi.User.StudentCredential.CourseId,
          candidates: [candi],
        });
      }
    });

    return arr;
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
    this.chartLoading = true

    this.electionService
      .getPrediction({
        ElectionId: this.election.id,
        ElectionPositionId: position.id,
      })
      .subscribe(
        (response: any) => {

          console.log(response)

          response.ElectionCandidates.forEach((candidate: any) => {
            if (candidate.Sentiments.length > 0) {
              this.hasSentiments = true;
            }
          });

          if (this.hasSentiments == false) {
            this.chartLoading = false
            return
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

          this.chartLoading = false

          console.log(this.chartData)
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
      voterId: data.UserId,
    });
  }

  getResult() {
    let temp: any = [];

    this.election.ElectionPositions.forEach((position: any) => {
      if (position.allowedCourse != 0) {
        let arr: any = [];

        position.ElectionCandidates.forEach((candi: any) => {
          let id = candi.User.StudentCredential.CourseId;

          let bb = null;

          if (arr.length >= 1) {
            arr.forEach((item: any, idx: any) => {
              if (id == item.course) {
                arr[idx].candidates.push(candi);
              } else {
                bb = true;
              }
            });

            if (bb && undefined == arr.find((item: any) => item.course == id)) {
              arr.push({
                course: candi.User.StudentCredential.CourseId,
                candidates: [candi],
              });
            }
          } else {
            arr.push({
              course: candi.User.StudentCredential.CourseId,
              candidates: [candi],
            });
          }
        });

        temp.push({
          positionId: position.id,
          title: position.title,
          allowed: position.allowedCourse,
          noOfWinners: position.no_of_winners,
          courseCandidates: [],
        });

        arr.forEach((aaa: any) => {
          const candi = aaa.candidates.sort((a: any, b: any) => {
            return b.ElectionVotes.length - a.ElectionVotes.length;
          });

          temp[temp.length - 1].courseCandidates.push({
            course: candi[0].User.StudentCredential.CourseId,
            candidates: candi,
          });
        });
      } else {
        const candidates = position.ElectionCandidates.sort(
          (x: any, y: any) => {
            return y.ElectionVotes.length - x.ElectionVotes.length;
          }
        );

        temp.push({
          positionId: position.id,
          title: position.title,
          allowed: position.allowedCourse,
          noOfWinners: position.no_of_winners,
          candidateSortedByVoteCount: candidates,
        });
      }
    });

    temp.forEach(async (item: any) => {
      let winners: any = [];
      let result: any = [];

      if (item.allowed == 0) {
        winners = await item.candidateSortedByVoteCount.slice(
          0,
          item.noOfWinners
        );
      } else {
        item.courseCandidates.forEach((each: any) => {
          let abc = each.candidates.slice(0, item.noOfWinners);

          winners.push({
            course: each.course,
            candidates: abc,
          });
        });

        winners.forEach((winner: any) => {
          winner.candidates.forEach((cand: any) => {
            cand.result = 'winner';
          });
        });

        this.electionResult.push({
          positionId: item.positionId,
          allowed: item.allowed,
          title: item.title,
          noOfWinners: item.noOfWinners,
          results: winners,
        });
      }

      if (item.allowed == 0) {
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
                let dd = result.filter(
                  (res: any) => res.candidateId == candi.id
                );

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
          allowed: item.allowed,
          title: item.title,
          noOfWinners: item.noOfWinners,
          results: result,
        });
      }
    });

    console.log(this.electionResult);
  }

  checkResult(candidate: any) {
    let result = null;

    this.electionResult.forEach((pos: any) => {
      if (pos.allowed == 0) {
        if (candidate.ElectionPositionId == pos.positionId) {
          pos.results.forEach((can: any) => {
            if (candidate.id == can.candidateId) {
              result = can.result;
            }
          });
        }
      } else {
        if (candidate.ElectionPositionId == pos.positionId) {
          pos.results.forEach((res: any) => {
            res.candidates.forEach((candi: any) => {
              if (candidate.id == candi.id) {
                result = candi.result != undefined ? candi.result : 'loser';
              }
            });
          });
        }
      }
    });

    return result;
  }

  getSentiments() {
    const data: any = {
      ElectionId: this.election.id,
    };

    this.electionService.getSentiments(data).subscribe(
      (response: any) => {
        console.log(response);
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

  getCourse(type: any, CourseId: any) {
    let courseTitle = null;

    this.courses.forEach((course: any) => {
      if (course.id == CourseId) {
        if(type == 2) {
          courseTitle = course.acronym;
        }
        else {
          courseTitle = course.title;
        }
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

  loadInputImgToSrc(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = () => {
      this.addCandidatePreviewImg = reader.result;
      this.addCandidateData.image = reader.result;
    };
  }
}
