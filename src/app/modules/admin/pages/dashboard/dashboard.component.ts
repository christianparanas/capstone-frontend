import { Component, OnInit } from '@angular/core';

import { ProfileService } from '../../shared/services/profile.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  date: any
  isMorning: any;
  isAfternoon: any;
  isEvening: any;
  isNight: any;

  profile: any = []

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.getProfile()
    this.date = new Date();

    this.isMorning = this.date.getHours() > 5 && this.date.getHours() <= 12;
    this.isAfternoon = this.date.getHours() > 12 && this.date.getHours() <= 18;
    this.isEvening = this.date.getHours() > 18 && this.date.getHours() <= 22;
    this.isNight = this.date.getHours() > 22 || this.date.getHours() <= 5;
  }

  getProfile() {
    this.profileService.getProfile().subscribe((response: any) => {
      this.profile = response
    }, (error: any) => {})
  }

}
