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

import { AuthFacultyService } from '../services/auth-faculty.service';

@Injectable({
  providedIn: 'root',
})
export class FacultyGuard implements CanActivate {
  constructor(
    private authFacultyService: AuthFacultyService,
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
    if (this.authFacultyService.isLoggedIn()) return true;

    this.router.navigate([`/login`], {
      queryParams: { type: 'faculty' },
    });
    this.toast.info('Please login!', { position: 'top-right' });
    return false;
  }
}
