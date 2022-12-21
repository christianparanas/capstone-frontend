import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';

import { StudentService } from '../../shared/services/student.service';
import { ProfileService } from '../../shared/services/profile.service';
import { ChatService } from '../../shared/services/chat.service';
import { EventService } from '../../shared/services/event.service';
import { UserService } from '../../shared/services/user.service';

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

  actionModal: boolean = false;
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

  status: boolean = false;
  submitLoading: boolean = false;

  @ViewChild('scrollToBottom') scrollElement: any;

  constructor(
    private eventService: EventService,
    private location: Location,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: HotToastService,
    private profileService: ProfileService,
    private chatService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((value) => {
      this.userId = value.id;
    });

    this.getUserData();
    this.getProfile();
  }

  setStatus() {
    const data = {
      status: this.status == true ? 'active' : 'inactive',
      userId: this.userData.id,
    };

    this.userService.updateUser(data).subscribe(
      (response: any) => {
        if (this.status == true) {
          this.toast.success('User account set to active');
        } else {
          this.toast.info('User account set to inactive');
        }
      },
      (err: any) => {
        this.toast.error(err.error.message);
      }
    );
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
        this.toast.success(response.message);
        this.router.navigate([`/admin/users`], {
          queryParams: { type: 'student' },
        });
      },
      (error: any) => {
        this.toast.error(error.error.message);
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

        this.status = response.status == 'active' ? true : false;
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
      return this.toast.info('Please type something.');
    }

    this.chat.push({
      UserId: this.profile.id,
      message: this.message,
      createdAt: new Date(),
    });

    this.eventService.sendMsg({
      chatId: this.chatId,
      receiverId: this.userData.id,
      senderId: this.profile.id,
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

  dateFormat(date: any) {
    return moment(date).format('lll');
  }

  deleteAccount() {
    const ans = confirm('Delete this account?');

    if (!ans) return;

    const data = {
      id: this.userData.id,
      studentId: this.userData.StudentCredential.schoolId,
    };

    this.studentService.deleteAccount(data).subscribe(
      (response: any) => {
        this.toast.success(response.message);
        this.router.navigate([`/admin/users`], {
          queryParams: { type: 'student' },
        });
      },
      (error: any) => {
        this.toast.error('Something went wrong');
      }
    );
  }
}
