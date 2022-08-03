import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getAdmins(): any {
    return this.http.get(`${BASEURL}/api/user/admin`);
  }

  addAdmin(data: any): any {
    return this.http.post(`${BASEURL}/api/user/admin`, data);
  }
}
