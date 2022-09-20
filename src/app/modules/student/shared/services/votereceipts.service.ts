import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;

@Injectable({
  providedIn: 'root',
})
export class VotereceiptsService {
  constructor(private http: HttpClient) {}

  getVoteReceipts(): any {
    return this.http.get(`${BASEURL}/api/election/studentreceipts`);
  }
}
