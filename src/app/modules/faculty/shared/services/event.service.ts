import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private socket: Socket) {}

  sendNewPollEvent(data: any) {
    this.socket.emit('newPollEvent', data);
  }

  getPollEvent(): Observable<any> {
    return this.socket.fromEvent<any>('pollEvent');
  }

  sendTweetEvent() {
    this.socket.emit('tweetEvent');
  }

  getTweetEvent(): Observable<any> {
    return this.socket.fromEvent<any>('tweetEvent');
  }
}
