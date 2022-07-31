import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../primeng/primeng.module';

import { AdminRoutingModule } from './admin-routing.module';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HeaderComponent } from './components/header/header.component';
import { AboutComponent } from './pages/about/about.component';
import { LogsComponent } from './pages/logs/logs.component';
import { UsersComponent } from './pages/users/users.component';
import { FeedbacksComponent } from './pages/feedbacks/feedbacks.component';
import { StudentTabComponent } from './components/student-tab/student-tab.component';
import { FacultyTabComponent } from './components/faculty-tab/faculty-tab.component';
import { AdminTabComponent } from './components/admin-tab/admin-tab.component';
import { UserComponent } from './pages/user/user.component';



@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent,
    LayoutComponent,
    HeaderComponent,
    AboutComponent,
    UsersComponent,
    LogsComponent,
    FeedbacksComponent,
    StudentTabComponent,
    FacultyTabComponent,
    AdminTabComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    PrimengModule
  ]
})
export class AdminModule { }
