import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

import { AuthStudentService } from '../services/auth-student.service';

@Injectable({
  providedIn: 'root',
})
export class StudentGuard implements CanActivate {
  constructor(
    private authStudentService: AuthStudentService,
    private router: Router,
    private toast: HotToastService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authStudentService.isLoggedIn()) return true;

    this.router.navigate([`/login`], {
      queryParams: { type: 'student' },
    });
    this.toast.info('Please login!', { position: 'top-right' });
    return false;
  }
}
