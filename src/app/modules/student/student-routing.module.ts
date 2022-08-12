import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentGuard } from 'src/app/core/shared/guards/student.guard';
import { LayoutComponent } from './components/layout/layout.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AboutComponent } from './pages/about/about.component';
import { ElectionComponent } from './pages/election/election.component';
import { CampaignComponent } from './pages/campaign/campaign.component';
import { TweetsComponent } from './pages/tweets/tweets.component';
import { PollsComponent } from './pages/polls/polls.component';
import { ReceiptsComponent } from './pages/receipts/receipts.component';
import { LogsComponent } from './pages/logs/logs.component';
import { UpdatesComponent } from './pages/updates/updates.component';
import { AccountComponent } from './pages/account/account.component';
import { TweetComponent } from './pages/tweet/tweet.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [StudentGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'election', component: ElectionComponent },
      { path: 'campaign', component: CampaignComponent },
      { path: 'tweets', component: TweetsComponent },
      { path: 'polls', component: PollsComponent },
      { path: 'receipts', component: ReceiptsComponent },
      { path: 'logs', component: LogsComponent },
      { path: 'updates', component: UpdatesComponent },
      { path: 'about', component: AboutComponent },
    ],
  },
  { path: 'account', component: AccountComponent },
  { path: 'tweet', component: TweetComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
