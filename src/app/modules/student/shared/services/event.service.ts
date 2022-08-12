import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private socket: Socket) {}

  sendPollVoteEvent(facultyId: any) {
    this.socket.emit('pollVoteEvent', facultyId);
  }

  getPollStatus(): Observable<any> {
    return this.socket.fromEvent<any>('pollStatus');
  }

  sendTweetEvent() {
    this.socket.emit('tweetEvent');
  }

  getTweetEvent(): Observable<any> {
    return this.socket.fromEvent<any>('tweetEvent');
  }
}
