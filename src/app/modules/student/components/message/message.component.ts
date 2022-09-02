import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Output() closeChatModal = new EventEmitter();

  chatId: any = null;
  message: string = '';
  user = {
    userId: 1,
    name: 'chan',
  };

  chat: any = [
    {
      userId: 2,
      name: 'thea',
      message: 'Hain na an at mga saad?',
    },
    {
      userId: 1,
      name: 'chan',
      message: 'fffff',
    },
    {
      userId: 2,
      name: 'thea',
      message: 'Hello',
    },
  ];

  @ViewChild('scrollToBottom') scrollElement: any;

  constructor(private toast: HotToastService) {}

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

    this.chat.push({
      userId: 1,
      name: 'chan',
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
}
