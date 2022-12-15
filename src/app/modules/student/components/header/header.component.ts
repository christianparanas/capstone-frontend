import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

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
  defaultImg: any = '../../../../../assets/images/student.png';

  notifications: any = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private profileService: ProfileService,
    private notificationService: NotificationService,
    private eventService: EventService,
    private router: Router,
    private toast: HotToastService
  ) {}

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
      title: 'Tweets',
      route: 'tweets',
      icon: 'fal fa-retweet',
    },
    {
      title: 'Polls',
      route: 'polls',
      icon: 'fal fa-poll-people',
    },
    {
      title: 'Vote Receipts',
      route: 'receipts',
      icon: 'fal fa-receipt',
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
    {
      title: 'About',
      route: 'about',
      icon: 'fal fa-info-circle',
    },
  ];

  ngOnInit(): void {
    this.getUser();
    window.addEventListener('scroll', this.listenScrollEvent);

    const route = this.route.snapshot.children[0].routeConfig?.path;
    route == '' ? (this.currentRoute = '/') : (this.currentRoute = route);
  }

  accountChangedPass() {
    if(this.user.isPasswordChange == 0) {

      this.toast.info('Please change your account password to access the restricted pages.')
      this.router.navigate(['/account'])
    }
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

  getUser() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.user = response;

        console.log(response)

        this.getNotifications();
        this.getNotificationEvent();
        this.accountChangedPass()
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getCurrentRouteURL(route: any) {
    route == '' ? (this.currentRoute = '/') : (this.currentRoute = route);
  }

  openCloseNavOverlay() {
    if (this.isNavOpen) {
      this.isNavOpen = false;
      return;
    }

    this.isNavOpen = true;
  }

  logout() {
    this.authService.logout('student');
  }

  listenScrollEvent = () => {
    window.scrollY > 15 ? (this.onScroll = true) : (this.onScroll = false);
  };
}
