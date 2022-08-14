import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;
const HELPER = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class AuthAdminService {
  decodedToken: any;
  isExpired: boolean;

  constructor(private http: HttpClient, private router: Router) {}

  login(data: any): any {
    return this.http.post(`${BASEURL}/api/auth/adminlogin`, data, {
      headers: { skip: 'true' },
    });
  }

  isLoggedIn(): boolean {
    const token: any = localStorage.getItem('admin_access_token');

    const isExpired = HELPER.isTokenExpired(token);

    if (isExpired) this.logout();
    return !isExpired;
  }

  setSession(data: any) {
    localStorage.setItem('admin_access_token', data.token);

    this.router.navigate([`/admin`]);
  }

  logout() {
    localStorage.removeItem('admin_access_token');
    this.router.navigate([`/login`], {
      queryParams: { type: 'admin' },
    });
  }
}
