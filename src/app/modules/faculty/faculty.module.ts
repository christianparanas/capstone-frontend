import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimengModule } from '../primeng/primeng.module';
import { FacultyRoutingModule } from './faculty-routing.module';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PollComponent } from './pages/poll/poll.component';
import { ElectionComponent } from './pages/election/election.component';
import { LogsComponent } from './pages/logs/logs.component';
import { UpdatesComponent } from './pages/updates/updates.component';
import { TweetsComponent } from './pages/tweets/tweets.component';
import { CampaignComponent } from './pages/campaign/campaign.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    LayoutComponent,
    SidebarComponent,
    PollComponent,
    ElectionComponent,
    LogsComponent,
    UpdatesComponent,
    TweetsComponent,
    CampaignComponent,
  ],
  imports: [CommonModule, FacultyRoutingModule, PrimengModule],
})
export class FacultyModule {}
