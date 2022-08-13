import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit {
  events: any[];

  constructor() {}

  ngOnInit(): void {
    this.events = [
      {
        date: '10:30 AM - June 12, 1999',
        description:
          'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cupiditate voluptate ducimus dignissimos molestias, hic ratione dolor asperiores accusamus vel doloremque!',
      },
      {
        date: '10:30 AM - June 12, 1999',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, officia.',
      },
      {
        date: '10:30 AM - June 12, 1999',
        description:
          'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis aliquam quia mollitia qui commodi numquam, perferendis omnis sit soluta alias! Fuga ipsa minus iste autem ab, fugit temporibus? Odit, ea.',
      },
    ];
  }
}
