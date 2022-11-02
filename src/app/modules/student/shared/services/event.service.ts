import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private socket: Socket) {}

  sendPollVoteEvent(data: any) {
    this.socket.emit('pollVoteEvent', data);
  }

  sendElectionVoteEvent(data: any) {
    this.socket.emit('electionVoteEvent', data);
  }

  getPollEvent(): Observable<any> {
    return this.socket.fromEvent<any>('pollEvent');
  }

  getElectionEvent(): Observable<any> {
    return this.socket.fromEvent<any>('electionEvent');
  }

  sendTweetEvent() {
    this.socket.emit('tweetEvent');
  }

  getTweetEvent(): Observable<any> {
    return this.socket.fromEvent<any>('tweetEvent');
  }

  getNewElectionEvent(): Observable<any> {
    return this.socket.fromEvent<any>('newElectionEvent');
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
