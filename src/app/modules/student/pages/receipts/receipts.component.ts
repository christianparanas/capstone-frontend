import { Component, OnInit } from '@angular/core';

import { VotereceiptsService } from '../../shared/services/votereceipts.service';
import { ProfileService } from '../../shared/services/profile.service';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss'],
})
export class ReceiptsComponent implements OnInit {
  receipts: any = [];
  profile: any = [];

  constructor(
    private votereceiptsService: VotereceiptsService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.getVoteReceipts();
  }

  getVoteReceipts() {
    this.votereceiptsService.getVoteReceipts().subscribe(
      (response: any) => {
        console.log(response);

        this.receipts = response;
      },
      (error: any) => {}
    );
  }
}
