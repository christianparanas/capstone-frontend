import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";


import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;
const HELPER = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthFacultyService {

  constructor(private http: HttpClient) {}

  login(data: any): any {
    return this.http.post(`${BASEURL}/api/auth/facultylogin`, data, {
      headers: { skip: 'true' },
    });
  }

  register(data: any): any {
    return this.http.post(`${BASEURL}/api/auth/facultyregister`, data, {
      headers: { skip: 'true' },
    });
  }

  isLoggedIn(): boolean {
    return true
  }

}
