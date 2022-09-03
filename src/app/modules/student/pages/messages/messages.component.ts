import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { HotToastService } from '@ngneat/hot-toast';

import { ProfileService } from '../../shared/services/profile.service';
import { UserService } from '../../shared/services/user.service';
import { ChatService } from '../../shared/services/chat.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  isChatOpen: boolean = false
  profile: any = []
  chats: any = []

  constructor(private location: Location,
    private userService: UserService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: HotToastService,
    private chatService: ChatService) { }

  ngOnInit(): void {
    this.getProfile()
  }

  getProfile() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.profile = response;
        this.getChats()
      },
      (error: any) => {}
    );
  }

  getChats() {
    this.chatService.getChats(this.profile.id).subscribe(
      (response: any) => {
        console.log(response)
        this.chats = response;
      },
      (error: any) => {}
    );
  }

}
