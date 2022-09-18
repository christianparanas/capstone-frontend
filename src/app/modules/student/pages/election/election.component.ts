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
  candidateModal: boolean = false
  isAlreadyVoted: boolean = false

  profile: any = []
  currentDate: string;
  courses: any;
  electionId: number;
  election: any = [];
  candidate: any = []
  votes: any = []

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
    this.getElectionEvent()
    this.getProfile()
  }

  getProfile() {
    this.profileService.getProfile().subscribe((res: any) => {
      this.profile = res

      this.getElection()
    })
  }

  checkIfAlreadyVoted() {
    
  }

  selectCandidate(data: any) {

    this.votes.forEach((item: any) => {
      if(data.ElectionPositionId == item.id) {
        item.ElectionCandidates.forEach((candidate: any) => {

            if(candidate.id == data.id) {
              if(candidate.isSelected == true) {
                candidate.isSelected = false
                item.selectedCandidateCount = item.selectedCandidateCount - 1
                this.candidateModal = false
                this.toast.info("Candidate Unvoted.")
              }
              else {
                if(item.selectedCandidateCount == item.no_of_winners) {
                  this.toast.error("Candidate Vote Exceeded")
                  this.candidateModal = false
                }
                else {
                  candidate.isSelected = true
                  item.selectedCandidateCount = item.selectedCandidateCount + 1
                  this.candidateModal = false
                  this.toast.success("Candidate Voted.")
                }
              }
            }
        })
      }
    })
  }

  vote() {
   let ans = confirm("Done Voting? this action cannot be undone.")

    if(ans) {
      this.electionService.vote(this.votes).subscribe((res: any) => {
        this.toast.success(res.message)
        this.getElection()
      })
    }
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

        console.log(response)

        response.ElectionPositions.forEach((position: any) => {
          this.votes.push({ ...position, selectedCandidateCount: 0 })
        })

        this.votes.forEach((item: any) => {
            item.ElectionCandidates.forEach((candidate: any) => {
              candidate.isSelected = false
            })
        })        

        this.election.ElectionVoters.forEach((voter: any) => {
          if(voter.UserId == this.profile.id) {
            this.isAlreadyVoted = true
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
    this.candidate = candidate
    this.candidateModal = true
  }

  goBack(): void {
    this.location.back();
  }

  dateFormat(date: any) {
    return moment(date).calendar();
  }
}
