import { Component, OnInit } from '@angular/core';

import { CourseService } from 'src/app/core/shared/services/course.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  courses: any = [];

  editCourseModal: boolean = false
  submitLoading: boolean = false
  
  editForm: any = {
    acronym: null,
    title: null,
    college: null
  }

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses() {
    this.courseService.getCourses().subscribe((response: any) => {
      this.courses = response;
    });
  }

  editCourse(courseId: any) {
    this.courses.forEach((course: any) => {
      if(course.id == courseId) {
        this.editForm = {
          acronym: course.acronym,
          title: course.title,
          college: course.college
        }
      }
    });

    this.editCourseModal = true
  }

  editFormSubmit() {
    console.log(this.editForm)
  }
}
