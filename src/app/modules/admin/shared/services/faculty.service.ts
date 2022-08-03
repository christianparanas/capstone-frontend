import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;

@Injectable({
  providedIn: 'root'
})
export class FacultyService {

  constructor(private http: HttpClient) {}

  getFaculties(): any {
    return this.http.get(`${BASEURL}/api/user/faculty`);
  }

  addFaculty(data: any): any {
    return this.http.post(`${BASEURL}/api/user/faculty`, data);
  }
}
