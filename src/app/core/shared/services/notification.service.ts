import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  getNotifications(userId: any): any {
    return this.http.get(`${BASEURL}/api/notification/${userId}`);
  }

  sendNotification(data: any): any {
    return this.http.post(`${BASEURL}/api/notification`, data);
  }
}
