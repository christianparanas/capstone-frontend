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

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentRoute = this.route.snapshot.routeConfig?.path
  }

  openCloseNavOverlay() {
    if(this.isNavOpen) {
      this.isNavOpen = false
      return
    }

    this.isNavOpen = true
  }

}
