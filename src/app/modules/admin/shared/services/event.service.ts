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

  getLogEvent(): Observable<any> {
    return this.socket.fromEvent<any>('logEvent');
  }

  getPollEvent(): Observable<any> {
    return this.socket.fromEvent<any>('pollEvent');
  }

  getElectionEvent(): Observable<any> {
    return this.socket.fromEvent<any>('electionEvent');
  }

  sendNewElectionEvent(data: any) {
    this.socket.emit('newElectionEvent', data);
  }

  openChat(chatId: any) {
    this.socket.emit('openChat', chatId);
  }

  closeChat(chatId: any) {
    this.socket.emit('closeChat', chatId);
  }

  newMsg() {
    return this.socket.fromEvent<any>('newMsg');
  }

  msgEvent() {
    return this.socket.fromEvent<any>('msgEvent');
  }

  chatMsgs(): Observable<any> {
    return this.socket.fromEvent<any>('chatMsgs');
  }

  sendMsg(data: any) {
    this.socket.emit('sendMsg', data);
  }

  getNotificationEvent(): Observable<any> {
    return this.socket.fromEvent<any>('notificationEvent');
  }
}
