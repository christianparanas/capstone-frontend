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

  getPollStatus(): Observable<any> {
    return this.socket.fromEvent<any>('facultyPollStatus');
  }
}
