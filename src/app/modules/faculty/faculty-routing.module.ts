import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FacultyGuard } from 'src/app/core/shared/guards/faculty.guard';

import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PollComponent } from './pages/poll/poll.component';
import { ElectionsComponent } from './pages/elections/elections.component';
import { ElectionComponent } from './pages/election/election.component';
import { LogsComponent } from './pages/logs/logs.component';
import { TweetsComponent } from './pages/tweets/tweets.component';
import { CampaignComponent } from './pages/campaign/campaign.component';
import { AccountComponent } from './pages/account/account.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { UserComponent } from './pages/user/user.component'

const routes: Routes = [
  {
    path: 'faculty',
    component: LayoutComponent,
    canActivate: [FacultyGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'elections', component: ElectionsComponent },
      { path: 'campaign', component: CampaignComponent },
      { path: 'poll', component: PollComponent },
      { path: 'tweets', component: TweetsComponent },
      { path: 'logs', component: LogsComponent },
    ],
  },
    { path: 'faculty/account', component: AccountComponent },
    { path: 'faculty/messages', component: MessagesComponent },
    { path: 'faculty/election', component: ElectionComponent },
    { path: 'faculty/user', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class FacultyRoutingModule {}
