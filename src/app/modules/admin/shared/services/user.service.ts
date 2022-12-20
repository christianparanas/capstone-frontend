import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getUser(userId: any): any {
    return this.http.get(`${BASEURL}/api/user/${userId}`);
  }

  updateUser(data: any): any {
    return this.http.put(`${BASEURL}/api/user`, data)
  }

  deleteAccount(data: any): any {
    return this.http.post(`${BASEURL}/api/user/delete`, data);
  }
}
