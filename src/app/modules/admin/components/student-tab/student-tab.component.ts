import { Component, OnInit } from '@angular/core';

import { StudentService } from '../../shared/services/student.service';

@Component({
  selector: 'app-student-tab',
  templateUrl: './student-tab.component.html',
  styleUrls: ['./student-tab.component.scss'],
})
export class StudentTabComponent implements OnInit {
  students: any;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses() {
    this.studentService.getStudents().subscribe(
      (response: any) => {
        this.students = response;

        console.log(response)
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
