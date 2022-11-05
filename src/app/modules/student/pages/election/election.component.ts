import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';

import { CourseService } from 'src/app/core/shared/services/course.service';
import { ElectionService } from '../../shared/services/election.service';
import { EventService } from '../../shared/services/event.service';
import { ProfileService } from '../../shared/services/profile.service';

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.scss'],
})
export class ElectionComponent implements OnInit {
  isLoading: boolean = true;
  submitLoading: boolean = false;
  candidateModal: boolean = false;
  isAlreadyVoted: boolean = false;

  profile: any = [];
  currentDate: string;
  courses: any;
  electionId: number;
  election: any = [];
  candidate: any = [];
  votes: any = [];
  electionResult: any = [];

  isVoteNotEmpty: boolean = false;
  winnersModal: boolean = false

  constructor(
    private courseService: CourseService,
    private electionService: ElectionService,
    private toast: HotToastService,
    private location: Location,
    private route: ActivatedRoute,
    private eventService: EventService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((value) => {
      this.electionId = value.id;
    });

    this.getCourses();
    this.getElectionEvent();
    this.getProfile();
  }

  getProfile() {
    this.profileService.getProfile().subscribe((res: any) => {
      this.profile = res;

      this.getElection();
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

  selectCandidate(data: any) {

    this.votes.forEach((item: any) => {
      if (data.ElectionPositionId == item.id) {
        item.ElectionCandidates.forEach((candidate: any) => {
          if (candidate.id == data.id) {
            if (candidate.isSelected == true) {
              candidate.isSelected = false;
              item.selectedCandidateCount = item.selectedCandidateCount - 1;
              this.candidateModal = false;
              this.toast.info('Candidate Unvoted.');

              this.checkIfBallotEmpty();
            } else {
              if (item.selectedCandidateCount == item.no_of_winners) {
                this.toast.error('Candidate Vote Exceeded');
                this.candidateModal = false;
              } else {
                candidate.isSelected = true;
                item.selectedCandidateCount = item.selectedCandidateCount + 1;
                this.candidateModal = false;
                this.toast.success('Candidate Voted.');

                this.checkIfBallotEmpty();
              }
            }
          }
        });
      }
    });
  }

  checkIfBallotEmpty() {
    this.votes.forEach((vote: any) => {
      if (vote.selectedCandidateCount > 0) {
        this.isVoteNotEmpty = true;
        return;
      }

      this.isVoteNotEmpty = false;
    });
  }

  vote() {
    let ans = confirm('Done Voting? this action cannot be undone.');

    if (ans) {
      this.electionService.vote(this.votes).subscribe((res: any) => {
        this.toast.success(res.message);

        const data = {
          electionId: this.election.id,
        };

        this.eventService.sendElectionVoteEvent(data);
        this.getElection();
      });
    }
  }

  getElectionEvent() {
    this.eventService.getElectionEvent().subscribe((response: any) => {
      if (response.electionId == this.election.id) {
        this.getElection();
      }
    });
  }

  getElection() {
    this.votes = []

    this.electionService.getElection(this.electionId).subscribe(
      (response: any) => {
        this.election = response;
        this.isLoading = false;

        console.log(response)

        this.getResult();

        response.ElectionPositions.forEach((position: any) => {
          this.votes.push({ ...position, selectedCandidateCount: 0 });
        });

        this.votes.forEach((item: any) => {
          item.ElectionCandidates.forEach((candidate: any) => {
            candidate.isSelected = false;
          });
        });

        this.election.ElectionVoters.forEach((voter: any) => {
          if (voter.UserId == this.profile.id) {
            this.isAlreadyVoted = true;
          }
        });
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
    this.candidate = candidate;
    this.candidateModal = true;
  }

  goBack(): void {
    this.location.back();
  }

  dateFormat(date: any) {
    return moment(date).calendar();
  }
}
