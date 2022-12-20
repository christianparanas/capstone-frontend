import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;

@Injectable({
  providedIn: 'root',
})
export class ElectionService {
  constructor(private http: HttpClient) {}

  getElection(electionId: number): any {
    return this.http.get(`${BASEURL}/api/election/admin/${electionId}`);
  }

  getElections(): any {
    return this.http.get(`${BASEURL}/api/election`);
  }

  getVoteReceipt(data: any): any {
    return this.http.get(`${BASEURL}/api/election/studentreceipt/${data.electionId}/${data.voterId}`);
  }

  getVoters(): any {
    return this.http.get(`${BASEURL}/api/election/voters`);
  }

  getPrediction(data: any): any {
    return this.http.post(`${BASEURL}/api/election/prediction`, data);
  }

  getSentiments(data: any): any {
    return this.http.post(`${BASEURL}/api/election/sentiments`, data);
  }

}
