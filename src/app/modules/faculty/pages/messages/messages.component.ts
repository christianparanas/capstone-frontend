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
  currentChatId: any = '';
  isLoading: boolean = true

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
    this.getMsgEvent();
  }

  getMsgEvent() {
    this.eventService.msgEvent().subscribe((response: any) => {
      if (response.receiverId == this.profile.id) {
        this.chats.forEach((chat: any) => {
          if (chat.Chat.id == response.chatId) {
            chat.Chat.ChatMessages.push({
              message: response.message,
              ChatId: response.chatId,
              UserId: response.senderId,
            });
          }
        });
      }
    });
  }

  closeChat() {
    this.isChatOpen = false;
    this.eventService.closeChat(this.currentChatId);

    this.chats.forEach((chat: any) => {
      if(chat.ChatId == this.currentChatId) {
        chat.isSelected = false
      }
    })
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

  async openChat(chatId: any, user: any) {
    this.eventService.closeChat(this.currentChatId);
    this.closeChat()

    this.currentChatId = chatId;
    this.eventService.openChat(chatId);

    this.eventService.chatMsgs().subscribe((response: any) => {
      this.chatData = {
        chatId: chatId,
        user: user,
        ownId: this.profile.id,
        messages: response,
      };
    });

    this.isChatOpen = true;

    this.chats.forEach((chat: any) => {
      if(chat.ChatId == chatId) {
        chat.isSelected = true
      }
    })
  }

  updateChat(e: any) {
    this.chats.forEach((item: any) => {
      if (e.chatId == item.Chat.id) {
        item.Chat.ChatMessages.push(e.data);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  getChats() {
    this.chatService.getChats(this.profile.id).subscribe(
      (response: any) => {
        response.forEach((item: any) => {
          this.chats.push({ ...item, isSelected: false });
        });

        this.isLoading = false
      },
      (error: any) => {
        this.isLoading = false
      }
    );
  }
}
