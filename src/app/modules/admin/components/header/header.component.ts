import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/core/shared/services/auth.service';
import { ProfileService } from '../../shared/services/profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isNavOpen: boolean = false;
  currentRoute: any;
  onScroll: boolean = false;
  user: any = [];
  defaultImg: any = '../../../../../assets/images/admin.png';

  routesArr: any = [
    {
      title: 'Dashboard',
      route: '/',
      icon: 'fal fa-chart-line',
      params: null,
    },
    {
      title: 'Elections',
      route: 'elections',
      params: null,
      icon: 'fal fa-box-ballot',
    },
    {
      title: 'Polls',
      route: 'polls',
      params: null,
      icon: 'fal fa-ad',
    },

    {
      title: 'Tweets',
      route: 'tweets',
      params: null,
      icon: 'fal fa-poll-people',
    },
    {
      title: 'Manage Users',
      route: 'users',
      params: 'student',
      icon: 'fal fa-receipt',
    },
    {
      title: 'Feedbacks',
      route: 'feedbacks',
      params: null,
      icon: 'fal fa-pallet',
    },
    {
      title: 'Messages',
      route: 'messages',
      params: null,
      icon: 'fal fa-comment',
    },
    {
      title: 'Courses',
      route: 'courses',
      params: null,
      icon: 'fal fa-comment',
    },
    {
      title: 'Logs',
      route: 'logs',
      params: null,
      icon: 'fal fa-pallet',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUser();
    window.addEventListener('scroll', this.listenScrollEvent);

    this.getCurrentRouteURL(this.route.snapshot.children[0].routeConfig?.path);
  }

  getCurrentRouteURL(route: any) {
    route == '' ? (this.currentRoute = '/') : (this.currentRoute = route);
  }

  goUser(data: any) {
    this.router.navigate([`/admin/${data.route}`], {
      queryParams: { type: data.params },
    });

    this.openCloseNavOverlay()
  }

  getUser() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.user = response;
      },
      (error: any) => {
      }
    );
  }

  openCloseNavOverlay() {
    if (this.isNavOpen) {
      this.isNavOpen = false;
      return;
    }

    this.isNavOpen = true;
  }

  logout() {
    this.authService.logout('admin');
  }

  listenScrollEvent = () => {
    window.scrollY > 15 ? (this.onScroll = true) : (this.onScroll = false);
  };
}
