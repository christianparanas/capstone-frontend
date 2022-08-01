import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentService } from '../../shared/services/student.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  userType: string = '';
  userId: number;
  userData: any;
  declineModal: boolean = false;
  approveModal: boolean = false;
  requestDecision: any;
  requestDecisionMessage: any;

  constructor(
    private location: Location,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((value) => {
      this.userType = value.type;
      this.userId = value.id;
    });

    this.getUserData();
  }

  sendDecision() {
    const data = {
      receiver: {
        firstName: this.userData.firstName,
        email: this.userData.email,
      },
      decision: this.requestDecision,
      message: this.requestDecisionMessage,
    };

    this.studentService.studentAccountApplication(data).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getUserData() {
    if (this.userType == 'student') {
      this.studentService.getStudent(this.userId).subscribe(
        (response: any) => {
          console.log(response);

          this.userData = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  goBack(): void {
    this.location.back();
  }
}
