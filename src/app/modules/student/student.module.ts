import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MentionModule } from 'angular-mentions';

import { CoreModule } from 'src/app/core/core.module';
import { StudentRoutingModule } from './student-routing.module';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AboutComponent } from './pages/about/about.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ElectionComponent } from './pages/election/election.component';
import { TweetsComponent } from './pages/tweets/tweets.component';
import { PollsComponent } from './pages/polls/polls.component';
import { ReceiptsComponent } from './pages/receipts/receipts.component';
import { LogsComponent } from './pages/logs/logs.component';

import { PrimengModule } from '../primeng/primeng.module';
import { AccountComponent } from './pages/account/account.component';
import { ElectionsComponent } from './pages/elections/elections.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { MessageComponent } from './components/message/message.component';
import { UserComponent } from './pages/user/user.component';
import { SearchComponent } from './pages/search/search.component';

import { LinkifyPipe } from './shared/pipes/linkify.pipe';
import { ReceiptComponent } from './components/receipt/receipt.component';

@NgModule({
  declarations: [
    LinkifyPipe,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    AboutComponent,
    LayoutComponent,
    ElectionComponent,
    TweetsComponent,
    PollsComponent,
    ReceiptsComponent,
    LogsComponent,
    AccountComponent,
    ElectionsComponent,
    MessagesComponent,
    MessageComponent,
    UserComponent,
    SearchComponent,
    ReceiptComponent,
  ],
  imports: [
    CoreModule,
    CommonModule,
    StudentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimengModule,
    HttpClientModule,
    MentionModule
  ]
})
export class StudentModule { }
