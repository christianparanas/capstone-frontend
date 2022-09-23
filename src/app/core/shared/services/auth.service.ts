import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  forgotpassword(data: string): any {
    return this.http.post(`${BASEURL}/api/auth/forgotpassword`, data);
  }

  resetpassword(data: any): any {
    return this.http.post(`${BASEURL}/api/auth/resetpassword`, data,);
  }
}
