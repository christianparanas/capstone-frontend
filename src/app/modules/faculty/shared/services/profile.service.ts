import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getProfile(): any {
    return this.http.get(`${BASEURL}/api/user/faculty/profile`);
  }

  updateProfile(data: any): any {
    return this.http.put(`${BASEURL}/api/user/faculty/profile`, data);
  }

  changePassword(data: any): any {
    return this.http.put(`${BASEURL}/api/user/student/changepassword`, data);
  }
}
