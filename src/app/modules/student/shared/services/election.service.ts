import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;

@Injectable({
  providedIn: 'root'
})
export class ElectionService {

  constructor(private http: HttpClient) {}

  getElection(electionId: number): any {
    return this.http.get(`${BASEURL}/api/election/author/${electionId}`);
  }

  getElections(data: any): any {
    return this.http.post(`${BASEURL}/api/election/student`, data);
  }
}
