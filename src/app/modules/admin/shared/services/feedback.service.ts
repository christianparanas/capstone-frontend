import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(private http: HttpClient) {}

  getFeedbacks(): any {
    return this.http.get(`${BASEURL}/api/feedback/`);
  }

  getPendingFeedbacks(): any {
    return this.http.get(`${BASEURL}/api/feedback/pending`);
  }

  changeFeedbackStatus(data: any): any {
    return this.http.post(`${BASEURL}/api/feedback/decision`, data);
  }
}
