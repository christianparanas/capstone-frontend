import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/core/shared/services/auth.service';
import { ProfileService } from '../../shared/services/profile.service';
import { NotificationService } from 'src/app/core/shared/services/notification.service';
import { EventService } from '../../shared/services/event.service';

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
  defaultImg: any = '../../../../../assets/images/faculty.png';

  notifications: any = []

  routesArr: any = [
    {
      title: 'Dashboard',
      route: '/',
      icon: 'fal fa-chart-line',
    },
    {
      title: 'Elections',
      route: 'elections',
      icon: 'fal fa-box-ballot',
    },
    {
      title: 'Polls',
      route: 'polls',
      icon: 'fal fa-poll-people',
    },
    {
      title: 'Voters',
      route: 'voters',
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
    private authService: AuthService,
    private profileService: ProfileService,
    private notificationService: NotificationService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.getUser();
    window.addEventListener('scroll', this.listenScrollEvent);

    const route = this.route.snapshot.children[0].routeConfig?.path;
    route == '' ? (this.currentRoute = '/') : (this.currentRoute = route);
  }

  getNotificationEvent() {
    this.eventService.getNotificationEvent().subscribe((response: any) => {
      if (response.userId == this.user.id) {
        this.getNotifications();
      }
    });
  }

  getNotifications() {
    this.notificationService.getNotifications(this.user.id).subscribe(
      (response: any) => {
        this.notifications = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getCurrentRouteURL(route: any) {
    route == '' ? (this.currentRoute = '/') : (this.currentRoute = route);

    this.openCloseNavOverlay();
  }

  getUser() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.user = response;

        this.getNotifications()

        this.getNotificationEvent();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  logout() {
    this.authService.logout('faculty');
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
