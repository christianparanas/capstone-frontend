import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss']
})
export class PollComponent implements OnInit {
  createPollModal: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

}
