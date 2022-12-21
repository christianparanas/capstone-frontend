import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MenuItem } from 'primeng/api';

import { ProfileService } from '../../shared/services/profile.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  tabItems: MenuItem[];
  activeItem: MenuItem;
  profile: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.getProfile();

    this.tabItems = [
      { label: 'Student', icon: 'pi pi-fw pi-user' },
      { label: 'Faculty', icon: 'pi pi-fw pi-users' },
    ];

    this.route.queryParams.subscribe((value) => {
      switch (value.type) {
        case 'student':
          this.activeItem = this.tabItems[0];
          break;
        case 'faculty':
          this.activeItem = this.tabItems[1];
          break;

        case 'admin':
          this.activeItem = this.tabItems[2];
          break;
      }
    });
  }

  getProfile() {
    this.profileService.getProfile().subscribe((response: any) => {
      this.profile = response;

      if (this.profile.position == 0 || this.profile.position == 5) {
        this.tabItems.push({ label: 'Admin', icon: 'pi pi-fw pi-users' });
      }
    });
  }

  changeTab(tab: any) {
    switch (tab.activeItem.label) {
      case 'Student':
        this.activeItem = this.tabItems[0];
        this.router.navigate([`/admin/users`], {
          queryParams: { type: 'student' },
        });
        break;

      case 'Faculty':
        this.activeItem = this.tabItems[1];
        this.router.navigate([`/admin/users`], {
          queryParams: { type: 'faculty' },
        });
        break;

      case 'Admin':
        this.activeItem = this.tabItems[2];
        this.router.navigate([`/admin/users`], {
          queryParams: { type: 'admin' },
        });
        break;
    }
  }
}
