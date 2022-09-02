import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { HotToastService } from '@ngneat/hot-toast';

import { ProfileService } from '../../shared/services/profile.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  defaultImg: any = '../../../../../assets/images/student.png';
  user: any = [];
  userId: any;
  chatModal: boolean = true;

  chatId: any = null;
  message: string = '';
  currentuser = {
    userId: 1,
    name: 'chan',
  };

  chat: any = [
    {
      userId: 2,
      name: 'thea',
      message: 'Hain na an at mga saad?',
    },
    {
      userId: 1,
      name: 'chan',
      message: 'fffff',
    },
    {
      userId: 2,
      name: 'thea',
      message: 'Hello',
    },
  ];

  @ViewChild('scrollToBottom') scrollElement: any;

  constructor(
    private location: Location,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((value) => {
      this.userId = value.id;

      this.getUser(value.id);
    });
  }

  getUser(id: any) {
    this.userService.getUser(id).subscribe(
      (response: any) => {
        console.log(response);
        this.user = response;
      },
      (error: any) => {}
    );
  }

  goBack(): void {
    this.location.back();
  }

  dateFormat(date: any) {
    return moment(date).format('llll');
  }

  chatTrack(item: any, index: any) {
    return `${item.id}-${index}`;
  }

  sendMessage() {
    if (this.message == '') {
      return this.toast.info('Please type something.', {
        position: 'top-right',
      });
    }

    this.chat.push({
      userId: 1,
      name: 'chan',
      message: this.message,
    });

    this.scrollToBottom();
    this.message = '';
  }

  scrollToBottom() {
    setTimeout(() => {
      this.scrollElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  scroll() {
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }
}
