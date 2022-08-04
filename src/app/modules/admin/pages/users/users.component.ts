import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  tabItems: MenuItem[];
  activeItem: MenuItem;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.tabItems = [
      { label: 'Student', icon: 'pi pi-fw pi-home' },
      { label: 'Faculty', icon: 'pi pi-fw pi-calendar' },
      { label: 'Admin', icon: 'pi pi-fw pi-pencil' },
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
