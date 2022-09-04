import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { HotToastService } from '@ngneat/hot-toast';

import { ProfileService } from '../../shared/services/profile.service';
import { UserService } from '../../shared/services/user.service';
import { ChatService } from '../../shared/services/chat.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  defaultImg: any = '../../../../../assets/images/student.png';
  user: any = [];
  profile: any = [];
  userId: any;
  chatModal: boolean = false;

  chatId: any = null;
  message: string = '';
  currentuser = {
    userId: 1,
    name: 'chan',
  };

  chat: any = [];

  @ViewChild('scrollToBottom') scrollElement: any;

  constructor(
    private location: Location,
    private userService: UserService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: HotToastService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((value) => {
      this.userId = value.id;
      this.getUser(value.id);
    });

    this.getProfile();
  }

  openChat() {
    const data = {
      userOneId: this.user.id,
      userTwoId: this.profile.id,
    };

    this.chatService.getChat(data).subscribe(
      (response: any) => {
        console.log(response);

        response.forEach((res: any) => {
          if (res.Chat.ChatParticipants[0].UserId == this.user.id) {
            this.chat = res.Chat.ChatMessages;
            this.chatId = res.Chat.id;
          }
        });

        console.log(this.chat);
      },
      (error: any) => {}
    );

    this.chatModal = true;
  }

  getProfile() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.profile = response;
      },
      (error: any) => {}
    );
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
      UserId: this.profile.id,
      message: this.message,
      createdAt: new Date(),
    });

    this.chatService
      .sendMessage({
        chatId: this.chatId,
        receiverId: this.user.id,
        senderId: this.profile.id,
        message: this.message,
      })
      .subscribe(
        (response: any) => {},
        (error: any) => {}
      );

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
