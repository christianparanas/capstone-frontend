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
    return this.http.get(`${BASEURL}/api/poll/${data}`);
  }
  
}
