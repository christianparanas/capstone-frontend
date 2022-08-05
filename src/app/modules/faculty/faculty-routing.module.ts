import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FacultyGuard } from 'src/app/core/shared/guards/faculty.guard';

import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PollComponent } from './pages/poll/poll.component';
import { ElectionComponent } from './pages/election/election.component';
import { LogsComponent } from './pages/logs/logs.component';
import { UpdatesComponent } from './pages/updates/updates.component';
import { TweetsComponent } from './pages/tweets/tweets.component';
import { CampaignComponent } from './pages/campaign/campaign.component';

const routes: Routes = [
  {
    path: 'faculty',
    component: LayoutComponent,
    canActivate: [FacultyGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'election', component: ElectionComponent },
      { path: 'campaign', component: CampaignComponent },
      { path: 'poll', component: PollComponent },
      { path: 'tweets', component: TweetsComponent },
      { path: 'updates', component: UpdatesComponent },
      { path: 'logs', component: LogsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class FacultyRoutingModule {}
