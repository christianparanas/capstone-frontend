import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private socket: Socket) {}

  sendTweetEvent() {
    this.socket.emit('tweetEvent');
  }

  getTweetEvent(): Observable<any> {
    return this.socket.fromEvent<any>('tweetEvent');
  }

  getPollEvent(): Observable<any> {
    return this.socket.fromEvent<any>('pollEvent');
  }

  openChat(chatId: any) {
    this.socket.emit('openChat', chatId);
  }

  newMsg() {
    return this.socket.fromEvent<any>('newMsg');
  }

  sendMsg(data: any) {
    this.socket.emit('sendMsg', data);
  }
}
