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
import { EventService } from '../../shared/services/event.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Output() closeChatModal = new EventEmitter();
  @Output() newMsg = new EventEmitter();
  @Input() chatData: any;

  message: string = '';

  @ViewChild('scrollToBottom') scrollElement: any;

  constructor(
    private toast: HotToastService,
    private chatService: ChatService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.getMsgEvent();
    this.scrollToBottom();
  }

  chatTrack(item: any, index: any) {
    return `${item.id}-${index}`;
  }

  closeChat() {
    this.closeChatModal.emit();
    this.newMsg.emit();
  }

  getMsgEvent() {
    this.eventService.newMsg().subscribe((response: any) => {
      this.chatData.messages.push({
        id: this.chatData.messages.length + 1,
        UserId: response.senderId,
        message: response.message,
        createdAt: new Date(),
      });

      this.scrollToBottom();
    });
  }

  sendMessage() {
    if (this.message == '') {
      return this.toast.info('Please type something.', {
        position: 'top-right',
      });
    }

    this.eventService.sendMsg({
      chatId: this.chatData.chatId,
      receiverId: this.chatData.user.id,
      senderId: this.chatData.ownId,
      message: this.message,
    });

    this.scrollToBottom();
    this.message = '';
  }

  selectMessage(messageId: any) {
    this.chatData.messages.forEach((msg: any) => {
      if (msg.id == messageId) {
        if (msg.isSelected == true) {
          msg.isSelected = false;
        } else {
          msg.isSelected = true;
        }
      } else {
        msg.isSelected = false;
      }
    });
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
