import { Component, OnInit } from '@angular/core';

import { StudentService } from '../../shared/services/student.service';

@Component({
  selector: 'app-student-tab',
  templateUrl: './student-tab.component.html',
  styleUrls: ['./student-tab.component.scss'],
})
export class StudentTabComponent implements OnInit {
  students: any;
  pendingStudentApplications: any;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.getStudents();
    this.getPendingStudentAccountApplications();
  }

  getStudents() {
    this.studentService.getStudents().subscribe(
      (response: any) => {
        this.students = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getPendingStudentAccountApplications() {
    this.studentService.getPendingStudentAccountApplications().subscribe(
      (response: any) => {
        this.pendingStudentApplications = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
