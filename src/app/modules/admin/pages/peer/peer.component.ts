import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { HotToastService } from '@ngneat/hot-toast';

import { ProfileService } from '../../shared/services/profile.service';
import { UserService } from '../../shared/services/user.service';
import { ChatService } from '../../shared/services/chat.service';
import { EventService } from '../../shared/services/event.service';

@Component({
  selector: 'app-peer',
  templateUrl: './peer.component.html',
  styleUrls: ['./peer.component.scss'],
})
export class PeerComponent implements OnInit {
  defaultImg: any = '../../../../../assets/images/student.png';
  user: any = [];
  profile: any = [];
  userId: any;
  chatModal: boolean = false;

  chatId: any = null;
  message: string = '';


  chat: any = [];
  currentChatId: any = ""

  @ViewChild('scrollToBottom') scrollElement: any;

  constructor(
    private location: Location,
    private userService: UserService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: HotToastService,
    private chatService: ChatService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((value) => {
      this.userId = value.id;
      this.getProfile();
    });

    this.getNewMsgEvent()
  }

  getNewMsgEvent() {
    this.eventService.newMsg().subscribe((response: any) => {
      if(response.receiverId == this.profile.id) {
        this.chat.push({
          message: response.message,
          UserId: response.senderId,
        })
      }
    });
  }


  openChat() {
    this.eventService.closeChat(this.currentChatId);

    const data = {
      userOneId: this.user.id,
      userTwoId: this.profile.id,
    };
    
    this.chatService.getChat(data).subscribe(
      (response: any) => {
        response.forEach((res: any) => {
          if (res.Chat.ChatParticipants[0].UserId == this.user.id) {
            console.log(res)

            this.chat = res.Chat.ChatMessages;
            this.chatId = res.Chat.id;

            this.currentChatId = res.Chat.id
            this.eventService.openChat(this.chatId);
          }
        });
      },
      (error: any) => {}
    );

    this.chatModal = true;
    this.scrollToBottom();
  }

  getProfile() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        if (this.userId == response.id) {
          return this.router.navigate(['/account']);
        }

        this.profile = response;
        this.getUser(this.userId);
      },
      (error: any) => {}
    );
  }

  getUser(id: any) {
    this.userService.getUser(id).subscribe(
      (response: any) => {
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

    this.eventService.sendMsg({
      chatId: this.chatId,
      receiverId: this.user.id,
      senderId: this.profile.id,
      message: this.message,
    })

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
