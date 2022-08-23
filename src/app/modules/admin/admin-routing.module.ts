import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from 'src/app/core/shared/guards/admin.guard';

import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserComponent } from './pages/user/user.component';
import { FeedbacksComponent } from './pages/feedbacks/feedbacks.component';
import { LogsComponent } from './pages/logs/logs.component';
import { UsersComponent } from './pages/users/users.component';
import { ElectionComponent } from './pages/election/election.component';
import { CampaignComponent } from './pages/campaign/campaign.component';
import { PollComponent } from './pages/poll/poll.component';
import { TweetComponent } from './pages/tweet/tweet.component';
import { SupportComponent } from './pages/support/support.component';
import { PredictionComponent } from './pages/prediction/prediction.component';
import { AccountComponent } from './pages/account/account.component';
import { ElectionsComponent } from './pages/elections/elections.component';

const routes: Routes = [
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'elections', component: ElectionsComponent },
      { path: 'polls', component: PollComponent },
      { path: 'campaigns', component: CampaignComponent },
      { path: 'predictions', component: PredictionComponent },
      { path: 'tweets', component: TweetComponent },
      { path: 'users', component: UsersComponent },
      { path: 'support', component: SupportComponent },
      { path: 'feedbacks', component: FeedbacksComponent },
      { path: 'logs', component: LogsComponent },
    ],
  },
  { path: 'admin/election', component: ElectionComponent },
  { path: 'admin/user', component: UserComponent },
  { path: 'admin/account', component: AccountComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
