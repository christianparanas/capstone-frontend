import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FacultyGuard } from 'src/app/core/shared/guards/faculty.guard';

import { LayoutComponent } from './components/layout/layout.component';
import { AboutComponent } from './pages/about/about.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'faculty',
    component: LayoutComponent,
    canActivate: [FacultyGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'about', component: AboutComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class FacultyRoutingModule {}
