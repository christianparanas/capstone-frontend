import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/core/shared/services/auth.service';
import { ProfileService } from '../../shared/services/profile.service';
import { NotificationService } from 'src/app/core/shared/services/notification.service';
import { EventService } from '../../shared/services/event.service';
import { CourseService } from 'src/app/core/shared/services/course.service';

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
  courses: any = [];
  defaultImg: any = '../../../../../assets/images/faculty.png';

  notifications: any = [];

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
    private eventService: EventService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    window.addEventListener('scroll', this.listenScrollEvent);

    const route = this.route.snapshot.children[0].routeConfig?.path;
    route == '' ? (this.currentRoute = '/') : (this.currentRoute = route);

    this.getUser();
    this.getCourses();
  }

  getNotificationEvent() {
    this.eventService.getNotificationEvent().subscribe((response: any) => {
      if (response.userId == this.user.id) {
        this.getNotifications();
      }
    });
  }

  getPosition(posId: any) {
    if (posId == 0) {
      return 'Head';
    }

    if (posId == 1) {
      return 'Scholarship Officer';
    }

    if (posId == 2) {
      return ' Administrative Aide';
    }

    if (posId == 3) {
      return 'Staff';
    }

    if (posId == 5) {
      return 'Director';
    }
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
        this.getNotifications();
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

  getCourse(CourseId: any) {
    let courseTitle = null;

    if (this.courses.length == 0) return;

    this.courses.forEach((course: any) => {
      if (course.id == CourseId) {
        courseTitle = course.acronym;
      }
    });

    return courseTitle;
  }

  getCourses() {
    this.courseService.getCourses().subscribe(
      (response: any) => {
        this.courses = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
