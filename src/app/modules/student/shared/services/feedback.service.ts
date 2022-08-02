import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) {}

  getFeedbacks(): any {
    return this.http.get(`${BASEURL}/api/feedback`);
  }

  getApprovedFeedbacks(): any {
    return this.http.get(`${BASEURL}/api/feedback/approved`);
  }

  addFeedback(data: any): any {
    return this.http.post(`${BASEURL}/api/feedback`, data);
  }
}
