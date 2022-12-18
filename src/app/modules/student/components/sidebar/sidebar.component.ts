import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  currentRoute: any;

  routesArr: any = [
    {
      title: 'Dashboard',
      route: '/',
      icon: 'fal fa-chart-line',
    },
    {
      title: 'Elections',
      route: 'elections',
      icon: 'fal fa-box-ballot',
    },
    {
      title: 'Tweets',
      route: 'tweets',
      icon: 'fal fa-retweet',
    },
    {
      title: 'Polls',
      route: 'polls',
      icon: 'fal fa-poll-people',
    },
    {
      title: 'Receipts',
      route: 'receipts',
      icon: 'fal fa-receipt',
    },
    {
      title: 'Messages',
      route: 'messages',
      icon: 'fal fa-comment-alt',
    },
    {
      title: 'Logs',
      route: 'logs',
      icon: 'fal fa-pallet',
    },
    {
      title: 'About',
      route: 'about',
      icon: 'fal fa-info-circle',
    },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getCurrentRouteURL(this.route.snapshot.children[0].routeConfig?.path);
  }

  getCurrentRouteURL(route: any) {
    route == '' ? (this.currentRoute = '/') : (this.currentRoute = route);
  }
}
