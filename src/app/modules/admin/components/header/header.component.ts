import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isNavOpen: boolean = false
  currentRoute: any;
  onScroll: boolean = false;

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
    window.addEventListener('scroll', this.listenScrollEvent);

    const route = this.route.snapshot.children[0].routeConfig?.path
    route == '' ? this.currentRoute = '/' : this.currentRoute = route; 
  }

  getCurrentRouteURL(route: any) {
    route == '' ? this.currentRoute = '/' : this.currentRoute = route;

    this.openCloseNavOverlay()
  }

  openCloseNavOverlay() {
    if(this.isNavOpen) {
      this.isNavOpen = false
      return
    }

    this.isNavOpen = true
  }

  listenScrollEvent = () => {
    window.scrollY > 15 ? (this.onScroll = true) : (this.onScroll = false);
  };

}
