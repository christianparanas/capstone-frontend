import { Component, OnInit } from '@angular/core';

import { CourseService } from 'src/app/core/shared/services/course.service';
import { ElectionService } from '../../shared/services/election.service';
import { ProfileService } from '../../shared/services/profile.service';

@Component({
  selector: 'app-voters',
  templateUrl: './voters.component.html',
  styleUrls: ['./voters.component.scss'],
})
export class VotersComponent implements OnInit {
  courses: any = [];
  voters: any = [];
  user: any = [];
  filteredVoters: any = [];

  isLoading: boolean = true;

  filter: any = {
    CourseId: 0,
    section: 0,
    year: 0,
  };

  constructor(
    private courseService: CourseService,
    private electionService: ElectionService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.getCourses();
    this.getVoters();
    this.getProfile();
  }

  filterVotersArr() {
    this.filteredVoters = this.voters.filter(
      (item: any) =>
        (this.filter.CourseId == item.StudentCredential.CourseId ||
          this.filter.CourseId == 0) &&
        (this.filter.section == item.StudentCredential.section ||
          this.filter.section == 0) &&
        (this.filter.year == item.StudentCredential.year ||
          this.filter.year == 0)
    );
  }

  getProfile() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.user = response;
      },
      (error: any) => {}
    );
  }

  getVoters() {
    const data = {
      course: 0,
      section: 0,
      year: 0,
    };

    this.electionService.getVoters(data).subscribe(
      (response: any) => {
        this.voters = response;
        this.isLoading = false;
        console.log(response)

        this.filterVotersArr();
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
}
