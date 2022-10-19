import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const skipIntercept = req.headers.has('skip');

    if (skipIntercept) {
      const req1 = req.clone({
        headers: req.headers.delete('skip'),
      });
      return next.handle(req1);
    }

    if (req.headers.get('skip')) return next.handle(req);

    let studentToken: any = localStorage.getItem('student_access_token');
    let facultyToken: any = localStorage.getItem('faculty_access_token');
    let adminToken: any = localStorage.getItem('admin_access_token');

    if (studentToken == null || this.authService.isLoggedIn('student') == false)
      studentToken = 'christian';
    if (facultyToken == null || this.authService.isLoggedIn('faculty') == false)
      facultyToken = 'christian';
    if (adminToken == null || this.authService.isLoggedIn('admin') == false)
      adminToken = 'christian';

    const modifiedReq = req.clone({
      headers: req.headers
        .set('student_access_token', studentToken)
        .set('faculty_access_token', facultyToken)
        .set('admin_access_token', adminToken),
    });
    return next.handle(modifiedReq);
  }
}
