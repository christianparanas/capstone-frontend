import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthFacultyService } from 'src/app/core/shared/services/auth-faculty.service';
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
  user: any;
  defaultImg: any = '../../../../../assets/images/faculty.png';

  routesArr: any = [
    {
      title: 'Dashboard',
      route: '/',
      icon: 'fal fa-chart-line',
    },
    {
      title: 'Election',
      route: 'elections',
      icon: 'fal fa-box-ballot',
    },
    {
      title: 'Campaign',
      route: 'campaign',
      icon: 'fal fa-ad',
    },
    {
      title: 'Polls',
      route: 'poll',
      icon: 'fal fa-poll-people',
    },
    {
      title: 'Tweets',
      route: 'tweets',
      icon: 'fal fa-retweet',
    },
    {
      title: 'Messages',
      route: 'messages',
      icon: 'fal fa-comment-alt',
    },
    {
      title: 'Logs',
      route: 'logs',
      icon: 'fal fa-pallet',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private authFacultyService: AuthFacultyService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.getUser();
    window.addEventListener('scroll', this.listenScrollEvent);

    const route = this.route.snapshot.children[0].routeConfig?.path;
    route == '' ? (this.currentRoute = '/') : (this.currentRoute = route);
  }

  getCurrentRouteURL(route: any) {
    route == '' ? (this.currentRoute = '/') : (this.currentRoute = route);

    this.openCloseNavOverlay();
  }

  getUser() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.user = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  logout() {
    this.authFacultyService.logout();
  }

  openCloseNavOverlay() {
    if (this.isNavOpen) {
      this.isNavOpen = false;
      return;
    }

    this.isNavOpen = true;
  }

  listenScrollEvent = () => {
    window.scrollY > 15 ? (this.onScroll = true) : (this.onScroll = false);
  };
}
