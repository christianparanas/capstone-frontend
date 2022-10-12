import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

import { CourseService } from 'src/app/core/shared/services/course.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  courses: any = [];

  editCourseModal: boolean = false
  createCourseModal: boolean = false
  submitLoading: boolean = false

  createForm: FormGroup;
  editForm: FormGroup;

  constructor(private courseService: CourseService, private toast: HotToastService) {}

  ngOnInit(): void {
    this.getCourses();

    this.createForm = new FormGroup({
      acronym: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      college: new FormControl('', Validators.required),
    });

    this.editForm = new FormGroup({
      courseId: new FormControl(''),
      acronym: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      college: new FormControl('', Validators.required),
    });
  }

  getCourses() {
    this.courseService.getCourses().subscribe((response: any) => {
      this.courses = response;
    });
  }

  editCourse(courseId: any) {
    this.courses.forEach((course: any) => {
      if(course.id == courseId) {
        this.editForm.setValue({
          courseId: course.id,
          acronym: course.acronym,
          title: course.title,
          college: course.college
        })
      }
    });

    this.editCourseModal = true
  }

  deleteCourse(courseId: any) {
    let ans = confirm("Are you sure do you want to delete this course? This action cannot be undone and it may result to some problem in the system since it is a dependency data.")
  
    if(ans) {
      this.courseService.deleteCourse(courseId).subscribe(
        (response: any) => {
          this.getCourses();
          this.toast.success(response.message);
        },
        (error: any) => {
          this.submitLoading = false;
          this.toast.error(error.error.message);
        }
      );
    }
  }
  

  editFormSubmit() {
    if (!this.editForm.valid) {
      this.toast.warning('Please fill out the fields with valid data.', {
        position: 'top-right',
      });
      return;
    }

    this.submitLoading = true;

    this.courseService.editCourse(this.editForm.value).subscribe(
      (response: any) => {
        this.submitLoading = false;
        this.editForm.reset();
        this.editCourseModal = false;
        this.getCourses();
        this.toast.success(response.message);
      },
      (error: any) => {
        this.submitLoading = false;
        this.toast.error(error.error.message);
      }
    );
  }

  onSubmit() {
    if (!this.createForm.valid) {
      this.toast.warning('Please fill out the fields with valid data.', {
        position: 'top-right',
      });
      return;
    }

    this.submitLoading = true;

    this.courseService.createCourse(this.createForm.value).subscribe(
      (response: any) => {
        this.submitLoading = false;
        this.createForm.reset();
        this.createCourseModal = false;
        this.getCourses();
        this.toast.success(response.message);
      },
      (error: any) => {
        this.submitLoading = false;
        this.toast.error(error.error.message);
      }
    );
  }
}
