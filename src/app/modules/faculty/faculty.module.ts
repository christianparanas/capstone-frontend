import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../primeng/primeng.module';
import { CoreModule } from 'src/app/core/core.module';
import { FacultyRoutingModule } from './faculty-routing.module';


import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PollComponent } from './pages/poll/poll.component';
import { ElectionComponent } from './pages/election/election.component';
import { LogsComponent } from './pages/logs/logs.component';
import { TweetsComponent } from './pages/tweets/tweets.component';
import { CampaignComponent } from './pages/campaign/campaign.component';
import { AccountComponent } from './pages/account/account.component';
import { ElectionsComponent } from './pages/elections/elections.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { MessageComponent } from './components/message/message.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    LayoutComponent,
    SidebarComponent,
    PollComponent,
    ElectionComponent,
    LogsComponent,
    TweetsComponent,
    CampaignComponent,
    AccountComponent,
    ElectionsComponent,
    MessagesComponent,
    MessageComponent,
  ],
  imports: [CoreModule, CommonModule, FacultyRoutingModule, PrimengModule, ReactiveFormsModule, FormsModule],
})
export class FacultyModule {}
