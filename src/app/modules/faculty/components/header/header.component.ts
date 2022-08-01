import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';

import { AuthFacultyService } from 'src/app/core/shared/services/auth-faculty.service';

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
      title: "Election",
      route: "election",
      icon: "fal fa-box-ballot"
    },
    {
      title: "Campaign",
      route: "campaign",
      icon: "fal fa-ad"
    },
    {
      title: "Tweets",
      route: "tweets",
      icon: "fal fa-retweet"
    },
    {
      title: "Polls",
      route: "polls",
      icon: "fal fa-poll-people"
    },
    {
      title: "Vote Receipts",
      route: "receipts",
      icon: "fal fa-receipt"
    },{
      title: "Logs",
      route: "logs",
      icon: "fal fa-pallet"
    },
    {
      title: "Live Updates",
      route: "polls",
      icon: "fal fa-heart-rate"
    },
    {
      title: "Feedbacks",
      route: "feedbacks",
      icon: "fal fa-comment"
    },
    {
      title: "About",
      route: "about",
      icon: "fal fa-info-circle"
    }
  ]

  constructor(private route: ActivatedRoute, private authFacultyService: AuthFacultyService) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.listenScrollEvent);

    const route = this.route.snapshot.children[0].routeConfig?.path
    route == '' ? this.currentRoute = '/' : this.currentRoute = route; 
  }

  getCurrentRouteURL(route: any) {
    route == '' ? this.currentRoute = '/' : this.currentRoute = route;

    this.openCloseNavOverlay()
  }

  logout() {
    this.authFacultyService.logout()
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
