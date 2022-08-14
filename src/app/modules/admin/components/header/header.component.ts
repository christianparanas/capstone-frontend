import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthAdminService } from 'src/app/core/shared/services/auth-admin.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isNavOpen: boolean = false;
  currentRoute: any;
  onScroll: boolean = false;

  routesArr: any = [];

  constructor(
    private route: ActivatedRoute,
    private authAdminService: AuthAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    window.addEventListener('scroll', this.listenScrollEvent);

    this.getCurrentRouteURL(this.route.snapshot.children[0].routeConfig?.path);

    this.isNavOpen = false;

    this.routesArr = [
      {
        title: 'Dashboard',
        route: '/',
        icon: 'fal fa-chart-line',
        params: null,
      },
      {
        title: 'Election',
        route: 'administer',
        params: null,
        icon: 'fal fa-box-ballot',
      },
      {
        title: 'Polls',
        route: 'poll',
        params: null,
        icon: 'fal fa-ad',
      },
      {
        title: 'Campaign',
        route: 'campaign',
        params: null,
        icon: 'fal fa-retweet',
      },
      {
        title: 'Prediction',
        route: 'prediction',
        params: null,
        icon: 'fal fa-poll-people',
      },
      {
        title: 'Tweet',
        route: 'tweet',
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
        title: 'Customer Support',
        route: 'support',
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
  }

  getCurrentRouteURL(route: any) {
    route == '' ? (this.currentRoute = '/') : (this.currentRoute = route);
  }

  goUser(data: any) {
    this.router.navigate([`/admin/${data.route}`], {
      queryParams: { type: data.params },
    });
  }

  openCloseNavOverlay() {
    if (this.isNavOpen) {
      this.isNavOpen = false;
      return;
    }

    this.isNavOpen = true;
  }

  logout() {
    this.authAdminService.logout();
  }

  listenScrollEvent = () => {
    window.scrollY > 15 ? (this.onScroll = true) : (this.onScroll = false);
  };
}
