import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) {}

  getChat(data: any): any {
    return this.http.post(`${BASEURL}/api/chat/direct`, data);
  }

  getChats(userId: any): any {
    return this.http.get(`${BASEURL}/api/chat/${userId}`);
  }
}
