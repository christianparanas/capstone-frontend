import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  getStudents(): any {
    return this.http.get(`${BASEURL}/api/user/student`);
  }
}
