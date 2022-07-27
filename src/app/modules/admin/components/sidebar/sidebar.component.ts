import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  currentRoute: any;

  routesArr: any = [
    {
      title: "Dashboard",
      route: "/",
      icon: "fal fa-chart-line"
    },
    {
      title: "Administer on Election",
      route: "administer",
      icon: "fal fa-box-ballot"
    },
    {
      title: "Polls",
      route: "poll",
      icon: "fal fa-ad"
    },
    {
      title: "Campaign",
      route: "campaign",
      icon: "fal fa-retweet"
    },
    {
      title: "Prediction",
      route: "prediction",
      icon: "fal fa-poll-people"
    },
    {
      title: "Manage Users",
      route: "users",
      icon: "fal fa-receipt"
    },{
      
      title: "Feedbacks",
      route: "feedbacks",
      icon: "fal fa-pallet"
    },
    {
      
      title: "Messages",
      route: "messages",
      icon: "fal fa-pallet"
    },
    {
      
      title: "Logs",
      route: "logs",
      icon: "fal fa-pallet"
    },

  ]

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getCurrentRouteURL(this.route.snapshot.children[0].routeConfig?.path);
    
    console.log(this.currentRoute);
    
  }

  getCurrentRouteURL(route: any) {
    route == '' ? this.currentRoute = '/' : this.currentRoute = route;
  }

}
