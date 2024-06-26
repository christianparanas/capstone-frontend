import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;

@Injectable({
  providedIn: 'root'
})
export class ElectionService {

  constructor(private http: HttpClient) {}

  vote(data: any): any {
    return this.http.post(`${BASEURL}/api/election/vote`, data);
  }

  getPrediction(data: any): any {
    return this.http.post(`${BASEURL}/api/election/prediction`, data);
  }

  getSentiments(data: any): any {
    return this.http.post(`${BASEURL}/api/election/sentiments`, data);
  }

  getElection(electionId: number): any {
    return this.http.get(`${BASEURL}/api/election/student/${electionId}`);
  }

  getElections(data: any): any {
    return this.http.post(`${BASEURL}/api/election/student`, data);
  }

  getVoters(): any {
    return this.http.get(`${BASEURL}/api/election/voters`);
  }

}
