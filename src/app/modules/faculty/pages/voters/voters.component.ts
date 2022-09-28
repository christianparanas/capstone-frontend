import { Component, OnInit } from '@angular/core';

import { CourseService } from 'src/app/core/shared/services/course.service';
import { ElectionService } from '../../shared/services/election.service';

@Component({
  selector: 'app-voters',
  templateUrl: './voters.component.html',
  styleUrls: ['./voters.component.scss']
})
export class VotersComponent implements OnInit {
  courses: any = []
  voters: any = []

  isLoading: boolean = true

  constructor(private courseService: CourseService, private electionService: ElectionService) { }

  ngOnInit(): void {
    this.getCourses()
    this.getVoters()
  }

  getVoters() {
    const data = {
      course: 0,
      section: 0,
      year: 0
    }

    this.electionService.getVoters(data).subscribe(
      (response: any) => {
        this.voters = response;
        this.isLoading = false
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
