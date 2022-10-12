import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;
const HELPER = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private http: HttpClient) {}

  getCourses(): any {
    return this.http.get(`${BASEURL}/api/course`);
  }

  createCourse(data: any): any {
    return this.http.post(`${BASEURL}/api/course`, data);
  }

  editCourse(data: any): any {
    return this.http.put(`${BASEURL}/api/course`, data);
  }

  deleteCourse(courseId: number): any {
    return this.http.delete(`${BASEURL}/api/course/${courseId}`);
  }
}
