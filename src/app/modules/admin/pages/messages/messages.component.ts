import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { HotToastService } from '@ngneat/hot-toast';

import { ProfileService } from '../../shared/services/profile.service';
import { UserService } from '../../shared/services/user.service';
import { ChatService } from '../../shared/services/chat.service';
import { EventService } from '../../shared/services/event.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  isChatOpen: boolean = false;
  profile: any = [];
  chats: any = [];
  chatData: any;

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
    this.getProfile();
  }

  getProfile() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.profile = response;
        this.getChats();
      },
      (error: any) => {}
    );
  }

  chatTrack(item: any, index: any) {
    return `${item.id}-${index}`;
  }

  openChat(chatId: any, user: any) {
    this.eventService.openChat(chatId);

    this.chats.forEach(async (chat: any) => {
      if (chat.Chat.id == chatId) {
        let chatMsgs: any = [];

        await chat.Chat.ChatMessages.forEach((msg: any) => {
          chatMsgs.push({ ...msg, isSelected: false });
        });

        this.chatData = {
          chatId: chatId,
          user: user,
          ownId: this.profile.id,
          messages: chatMsgs,
        };

        chat.isSelected = true;
      } else {
        chat.isSelected = false;
      }
    });

    this.isChatOpen = true;
  }

  updateChat(e: any) {
    this.chats.forEach((item: any) => {
      if(e.chatId == item.Chat.id) {
        item.Chat.ChatMessages.push(e.data)
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  getChats() {
    this.chatService.getChats(this.profile.id).subscribe(
      async (response: any) => {
        response.forEach((item: any) => {
          this.chats.push({ ...item, isSelected: false });
        });
      },
      (error: any) => {}
    );
  }
}
