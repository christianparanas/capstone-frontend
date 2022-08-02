import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;

@Injectable({
  providedIn: 'root',
})
export class TweetService {
  constructor(private http: HttpClient) {}

  getTweets(): any {
    return this.http.get(`${BASEURL}/api/tweet`);
  }

  postTweet(data: any) {
    return this.http.post(`${BASEURL}/api/tweet`, data);
  }
}
