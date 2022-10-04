import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const BASEURL = environment.baseURL;

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) {}

  getAllLogs(): any {
    return this.http.get(`${BASEURL}/api/log`);
  }

  getLogs(userId: any): any {
    return this.http.get(`${BASEURL}/api/log/${userId}`);
  }

  addLog(data: any): any {
    return this.http.post(`${BASEURL}/api/log`, data);
  }
}
