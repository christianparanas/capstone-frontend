import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentGuard } from 'src/app/core/shared/guards/student.guard';
import { LayoutComponent } from './components/layout/layout.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AboutComponent } from './pages/about/about.component';
import { ElectionComponent } from './pages/election/election.component';
import { TweetsComponent } from './pages/tweets/tweets.component';
import { PollsComponent } from './pages/polls/polls.component';
import { ReceiptsComponent } from './pages/receipts/receipts.component';
import { LogsComponent } from './pages/logs/logs.component';
import { AccountComponent } from './pages/account/account.component';
import { ElectionsComponent } from './pages/elections/elections.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { UserComponent } from './pages/user/user.component';
import { SearchComponent } from './pages/search/search.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [StudentGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'elections', component: ElectionsComponent },
      { path: 'tweets', component: TweetsComponent },
      { path: 'polls', component: PollsComponent },
      { path: 'receipts', component: ReceiptsComponent },
      { path: 'logs', component: LogsComponent },
      { path: 'about', component: AboutComponent },
      { path: 'search', component: SearchComponent },
    ],
  },
  { path: 'election', component: ElectionComponent, canActivate: [StudentGuard], },
  { path: 'account', component: AccountComponent, canActivate: [StudentGuard], },
  { path: 'messages', component: MessagesComponent, canActivate: [StudentGuard], },
  { path: 'user', component: UserComponent, canActivate: [StudentGuard], },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
