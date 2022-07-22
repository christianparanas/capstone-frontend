import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isNavOpen: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

  openCloseNavOverlay() {
    if(this.isNavOpen) {
      this.isNavOpen = false
      return
    }

    this.isNavOpen = true
  }

}