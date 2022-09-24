import { Component, OnInit } from '@angular/core';


import { VotereceiptsService } from '../../shared/services/votereceipts.service';
import * as moment from 'moment';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss'],
})
export class ReceiptsComponent implements OnInit {
  receipts: any = [];
  profile: any = [];
  isLoading: boolean = true

  constructor(
    private votereceiptsService: VotereceiptsService,
  ) {}

  ngOnInit(): void {
    this.getVoteReceipts();
  }

  getVoteReceipts() {
    this.votereceiptsService.getVoteReceipts().subscribe(
      (response: any) => {
        this.receipts = response;
        this.isLoading = false
      },
      (error: any) => {
        this.isLoading = false
      }
    );
  }

  dateFormat(date: any) {
    return moment(date).calendar();
  }
}
