import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacultyRoutingModule } from './faculty-routing.module';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AboutComponent } from './pages/about/about.component';
import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    DashboardComponent,
    AboutComponent,
    HeaderComponent,
    LayoutComponent,
    SidebarComponent,
  ],
  imports: [CommonModule, FacultyRoutingModule],
})
export class FacultyModule {}
