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

import { AuthAdminService } from '../services/auth-admin.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authAdminService: AuthAdminService,
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
    if (this.authAdminService.isLoggedIn()) return true;

    this.router.navigate([`/login`], {
      queryParams: { type: 'admin' },
    });
    this.toast.info('Please login!', { position: 'top-right' });
    return false;
  }
}
