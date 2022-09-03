import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';

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
