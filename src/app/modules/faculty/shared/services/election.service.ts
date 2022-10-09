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
    return this.http.get(`${BASEURL}/api/election/author/${electionId}`);
  }

  getElections(): any {
    return this.http.get(`${BASEURL}/api/election/author`);
  }

  getPrediction(data: any): any {
    return this.http.post(`${BASEURL}/api/election/prediction`, data);
  }

  getStudentAccounts(data: any): any {
    return this.http.post(`${BASEURL}/api/election/studentaccounts`, data);
  }

  getVoters(data: any): any {
    return this.http.post(`${BASEURL}/api/election/voters`, data);
  }

  addElection(data: any): any {
    return this.http.post(`${BASEURL}/api/election`, data);
  }

  addElectionPosition(data: any): any {
    return this.http.post(`${BASEURL}/api/election/position`, data);
  }

  addCandidate(data: any): any {
    return this.http.post(`${BASEURL}/api/election/candidate`, data);
  }

  changeStatus(data: any): any {
    return this.http.post(`${BASEURL}/api/election/status`, data);
  }

  deleteElection(electionId: any): any {
    return this.http.delete(`${BASEURL}/api/election/${electionId}`);
  }

  deletePosition(data: any): any {
    return this.http.delete(
      `${BASEURL}/api/election/${data.electionId}/${data.electionPositionId}`
    );
  }

  deleteCandidate(data: any): any {
    return this.http.delete(
      `${BASEURL}/api/election/${data.electionId}/${data.electionPositionId}/${data.electionCandidateId}`
    );
  }

  getVoteReceipt(data: any): any {
    return this.http.get(
      `${BASEURL}/api/election/studentreceipt/${data.electionId}/${data.voterId}`
    );
  }
}
