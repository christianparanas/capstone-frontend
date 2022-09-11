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
}
