import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from 'src/app/core/shared/guards/admin.guard';

import { LayoutComponent } from './components/layout/layout.component';
import { AboutComponent } from './pages/about/about.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserComponent } from './pages/user/user.component';
import { FeedbacksComponent } from './pages/feedbacks/feedbacks.component';
import { LogsComponent } from './pages/logs/logs.component';

import { UsersComponent } from './pages/users/users.component';

const routes: Routes = [
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'feedbacks', component: FeedbacksComponent },
      { path: 'logs', component: LogsComponent },
      { path: 'about', component: AboutComponent },
    ],
  },
  { path: 'admin/user', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
