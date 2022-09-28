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
import { AccountComponent } from './pages/account/account.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { UserComponent } from './pages/user/user.component'
import { SearchComponent } from './pages/search/search.component';
import { VotersComponent } from './pages/voters/voters.component';

const routes: Routes = [
  {
    path: 'faculty',
    component: LayoutComponent,
    canActivate: [FacultyGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'elections', component: ElectionsComponent },
      { path: 'polls', component: PollComponent },
      { path: 'voters', component: VotersComponent },
      { path: 'tweets', component: TweetsComponent },
      { path: 'logs', component: LogsComponent },
      { path: 'search', component: SearchComponent },
    ],
  },
    { path: 'faculty/account', component: AccountComponent, canActivate: [FacultyGuard], },
    { path: 'faculty/messages', component: MessagesComponent, canActivate: [FacultyGuard], },
    { path: 'faculty/election', component: ElectionComponent,canActivate: [FacultyGuard], },
    { path: 'faculty/user', component: UserComponent, canActivate: [FacultyGuard], },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class FacultyRoutingModule {}
