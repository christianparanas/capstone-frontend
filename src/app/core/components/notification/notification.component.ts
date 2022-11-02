import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  @Input() notification: any;

  constructor() { }

  ngOnInit(): void {
  }

  dateFormat(date: any) {
    return moment(date).fromNow();
  }
}
