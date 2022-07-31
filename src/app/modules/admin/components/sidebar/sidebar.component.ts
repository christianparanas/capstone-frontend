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
      params: null,
    },
    {
      title: 'Administer on Election',
      route: 'administer',
      params: null,
      icon: 'fal fa-box-ballot',
    },
    {
      title: 'Polls',
      route: 'poll',
      params: null,
      icon: 'fal fa-ad',
    },
    {
      title: 'Campaign',
      route: 'campaign',
      params: null,
      icon: 'fal fa-retweet',
    },
    {
      title: 'Prediction',
      route: 'prediction',
      params: null,
      icon: 'fal fa-poll-people',
    },
    {
      title: 'Manage Users',
      route: 'users',
      params: 'student',
      icon: 'fal fa-receipt',
    },
    {
      title: 'Feedbacks',
      route: 'feedbacks',
      params: null,
      icon: 'fal fa-pallet',
    },
    {
      title: 'Messages',
      route: 'messages',
      params: null,
      icon: 'fal fa-pallet',
    },
    {
      title: 'Logs',
      route: 'logs',
      params: null,
      icon: 'fal fa-pallet',
    },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getCurrentRouteURL(this.route.snapshot.children[0].routeConfig?.path);

    console.log(this.currentRoute);
  }

  goUser(data: any) {
    this.router.navigate(
      [`/admin/${data.route}`],
      { queryParams: { type: data.params } }
    );
  }

  getCurrentRouteURL(route: any) {
    route == '' ? (this.currentRoute = '/') : (this.currentRoute = route);
  }
}
