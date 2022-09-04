import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';

import { StudentService } from '../../shared/services/student.service';
import { ProfileService } from '../../shared/services/profile.service';
import { ChatService } from '../../shared/services/chat.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  userType: string = '';
  userId: number;
  userData: any;
  profile: any = [];

  actionModal: boolean = false
  declineModal: boolean = false;
  approveModal: boolean = false;
  chatModal: boolean = false;
  requestDecision: any;
  requestDecisionMessage: any;
  isLoading: boolean = true;
  defaultImg: any = '../../../../../assets/images/student.png';

  message: any = '';
  chatId: any = null;
  chat: any = [];

  @ViewChild('scrollToBottom') scrollElement: any;

  constructor(
    private location: Location,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: HotToastService,
    private profileService: ProfileService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((value) => {
      this.userId = value.id;
    });

    this.getUserData();
    this.getProfile();
  }

  sendDecision() {
    const data = {
      receiver: {
        userId: this.userData.id,
        name: this.userData.name,
        email: this.userData.email,
      },
      decision: this.requestDecision,
      message: this.requestDecisionMessage,
    };

    this.studentService.studentAccountApplication(data).subscribe(
      (response: any) => {
        this.toast.success(response.message, { position: 'top-right' });
        this.router.navigate([`/admin/users`], {
          queryParams: { type: 'student' },
        });
      },
      (error: any) => {
        this.toast.error(error.error.message, { position: 'top-right' });
      }
    );
  }

  getProfile() {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.profile = response;
      },
      (error: any) => {}
    );
  }

  getUserData() {
    this.studentService.getStudent(this.userId).subscribe(
      (response: any) => {
        this.userData = response;
        this.isLoading = false;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  openChat() {
    const data = {
      userOneId: this.userData.id,
      userTwoId: this.profile.id,
    };

    this.chatService.getChat(data).subscribe(
      (response: any) => {
        response.forEach((res: any) => {
          if (res.Chat.ChatParticipants[0].UserId == this.userData.id) {
            this.chat = res.Chat.ChatMessages;
            this.chatId = res.Chat.id;
          }
        });
      },
      (error: any) => {}
    );

    this.chatModal = true;
  }

  goBack(): void {
    this.location.back();
  }

  momentFormatLLL(date: any) {
    return moment(date).format('lll');
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
        receiverId: this.userData.id,
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
