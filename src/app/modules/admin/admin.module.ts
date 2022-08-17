import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HeaderComponent } from './components/header/header.component';
import { LogsComponent } from './pages/logs/logs.component';
import { UsersComponent } from './pages/users/users.component';
import { FeedbacksComponent } from './pages/feedbacks/feedbacks.component';
import { StudentTabComponent } from './components/student-tab/student-tab.component';
import { FacultyTabComponent } from './components/faculty-tab/faculty-tab.component';
import { AdminTabComponent } from './components/admin-tab/admin-tab.component';
import { UserComponent } from './pages/user/user.component';
import { ElectionComponent } from './pages/election/election.component';
import { CampaignComponent } from './pages/campaign/campaign.component';
import { PollComponent } from './pages/poll/poll.component';
import { TweetComponent } from './pages/tweet/tweet.component';
import { SupportComponent } from './pages/support/support.component';
import { PredictionComponent } from './pages/prediction/prediction.component';
import { AccountComponent } from './pages/account/account.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent,
    LayoutComponent,
    HeaderComponent,
    UsersComponent,
    LogsComponent,
    FeedbacksComponent,
    StudentTabComponent,
    FacultyTabComponent,
    AdminTabComponent,
    UserComponent,
    ElectionComponent,
    CampaignComponent,
    PollComponent,
    TweetComponent,
    SupportComponent,
    PredictionComponent,
    AccountComponent,
  ],
  imports: [CommonModule, AdminRoutingModule, PrimengModule, FormsModule, ReactiveFormsModule],
})
export class AdminModule {}
