import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  studentLogin(data: any): any {
    return this.http.post(`${BASEURL}/api/auth/studentlogin`, data);
  }

  studentRegister(data: any): any {
    return this.http.post(`${BASEURL}/api/auth/studentregister`, data);
  }

  facultyLogin(data: any): any {
    return this.http.post(`${BASEURL}/api/auth/facultylogin`, data);
  }

  adminLogin(data: any): any {
    return this.http.post(`${BASEURL}/api/auth/adminlogin`, data);
  }

  forgotpassword(data: string): any {
    return this.http.post(`${BASEURL}/api/auth/forgotpassword`, data);
  }

  resetpassword(data: any): any {
    return this.http.post(`${BASEURL}/api/auth/resetpassword`, data,);
  }
}
