import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { StudentRoutingModule } from './student-routing.module';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AboutComponent } from './pages/about/about.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ElectionComponent } from './pages/election/election.component';
import { CampaignComponent } from './pages/campaign/campaign.component';
import { TweetsComponent } from './pages/tweets/tweets.component';
import { PollsComponent } from './pages/polls/polls.component';
import { ReceiptsComponent } from './pages/receipts/receipts.component';
import { LogsComponent } from './pages/logs/logs.component';

import { PrimengModule } from '../primeng/primeng.module';
import { AccountComponent } from './pages/account/account.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    AboutComponent,
    LayoutComponent,
    ElectionComponent,
    CampaignComponent,
    TweetsComponent,
    PollsComponent,
    ReceiptsComponent,
    LogsComponent,
    AccountComponent,
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimengModule,
    HttpClientModule,
  ]
})
export class StudentModule { }
