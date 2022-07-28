import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";


import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;
const HELPER = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthStudentService {

  constructor(private http: HttpClient) {}

  login(data: any): any {
    return this.http.post(`${BASEURL}/api/auth/studentlogin`, data, {
      headers: { skip: 'true' },
    });
  }

  register(data: any): any {
    return this.http.post(`${BASEURL}/api/auth/studentregister`, data, {
      headers: { skip: 'true' },
    });
  }

  isLoggedIn(): boolean {
    return true
  }
}
