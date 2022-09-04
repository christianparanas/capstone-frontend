import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';

import { ChatService } from '../../shared/services/chat.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Output() closeChatModal = new EventEmitter();
  @Input() chatData: any;

  message: string = '';

  @ViewChild('scrollToBottom') scrollElement: any;

  constructor(
    private toast: HotToastService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {}

  chatTrack(item: any, index: any) {
    return `${item.id}-${index}`;
  }

  closeChat() {
    this.closeChatModal.emit();
  }

  sendMessage() {
    if (this.message == '') {
      return this.toast.info('Please type something.', {
        position: 'top-right',
      });
    }

    this.chatData.messages.push({
      UserId: this.chatData.ownId,
      message: this.message,
      createdAt: new Date(),
    });

    this.chatService
      .sendMessage({
        chatId: this.chatData.chatId,
        receiverId: this.chatData.user.id,
        senderId: this.chatData.ownId,
        message: this.message,
      })
      .subscribe(
        (response: any) => {},
        (error: any) => {}
      );

    this.scrollToBottom();
    this.message = '';
  }

  selectMessage(messageId: any) {
    this.chatData.messages.forEach((msg: any) => {
      if(msg.id == messageId) {
        if(msg.isSelected == true) {
          msg.isSelected = false
        }
        else {
          msg.isSelected = true
        }
      }
      else {
        msg.isSelected = false
      }
    })
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
    return moment(date).calendar();
  }
  
}
