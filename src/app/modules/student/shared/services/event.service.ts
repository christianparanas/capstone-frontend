import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private socket: Socket) {}

  sendMessage() {
    this.socket.emit('message', 'hey');
  }

  getPollUpdate(): Observable<string> {
    return this.socket.fromEvent<string>('pollupdate');
  }
}
