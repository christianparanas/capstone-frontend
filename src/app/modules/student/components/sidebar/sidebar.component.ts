import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  currentRoute: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentRoute = this.route.snapshot.routeConfig?.path
  }

}
