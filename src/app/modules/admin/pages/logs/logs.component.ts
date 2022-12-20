import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MenuItem } from 'primeng/api';

import { LogService } from '../../shared/services/log.service';
import { ProfileService } from '../../shared/services/profile.service';
import { EventService } from '../../shared/services/event.service';
import { CourseService } from 'src/app/core/shared/services/course.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit {
  logs: any[];
  allLogs: any = [];
  userId: any;
  isLoading: boolean = true
  courses: any = [];

  tabItems: MenuItem[];
  activeItem: MenuItem;

  constructor(
    private logService: LogService,
    private profileService: ProfileService,
    private eventService: EventService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getAllLogs();
    this.getLogEvent();
    this.getCourses()

    this.tabItems = [
      { label: 'System', icon: 'pi pi-fw pi-users' },
      { label: 'User', icon: 'pi pi-fw pi-user' },
    ];

    this.activeItem = this.tabItems[0];
  }

  getLogEvent() {
    this.eventService.getLogEvent().subscribe((response: any) => {
      this.getAllLogs();
    });
  }

  logTrack(item: any, index: any) {
    return `${item.id}-${index}`;
  }

  changeTab(tab: any) {
    switch (tab.activeItem.label) {
      case 'System':
        this.activeItem = this.tabItems[0];
        break;

      case 'User':
        this.activeItem = this.tabItems[1];
        break;
    }
  }

  getAllLogs() {
    this.logService.getAllLogs().subscribe(
      (response: any) => {
        this.allLogs = response;
        this.isLoading = false

        console.log(response)
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getLogs() {
    this.logService.getLogs(this.userId).subscribe(
      (response: any) => {
        this.logs = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getUser() {
    this.profileService.getProfile().subscribe((response: any) => {
      this.userId = response.id;

      this.getLogs();
    });
  }

  dateFormat(date: any) {
    return moment(date).format('lll');
  }

  getCourse(CourseId: any) {
    let courseTitle = null;

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
