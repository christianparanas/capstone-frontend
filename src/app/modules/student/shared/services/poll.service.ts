import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;

@Injectable({
  providedIn: 'root'
})
export class PollService {

  constructor(private http: HttpClient) {}

  getPolls(data: any): any {
    return this.http.post(`${BASEURL}/api/poll/student`, data);
  }

  votePoll(data: any): any {
    return this.http.post(`${BASEURL}/api/poll/vote`, data);
  }
}
