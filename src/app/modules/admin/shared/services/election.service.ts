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

  getPrediction(data: any): any {
    return this.http.post(`${BASEURL}/api/election/prediction`, data);
  }

  getSentiments(data: any): any {
    return this.http.post(`${BASEURL}/api/election/sentiments`, data);
  }

  addElection(data: any): any {
    return this.http.post(`${BASEURL}/api/election`, data);
  }

  getStudentAccounts(data: any): any {
    return this.http.post(`${BASEURL}/api/election/studentaccounts`, data);
  }

  getVoters(): any {
    return this.http.get(`${BASEURL}/api/election/voters`);
  }


  addElectionPosition(data: any): any {
    return this.http.post(`${BASEURL}/api/election/position`, data);
  }

  addCandidate(data: any): any {
    return this.http.post(`${BASEURL}/api/election/candidate`, data);
  }

  addPartylist(data: any): any {
    return this.http.post(`${BASEURL}/api/election/partylist`, data);
  }

  finishSetup(data: any): any {
    return this.http.post(`${BASEURL}/api/election/finishsetup`, data);
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

}
