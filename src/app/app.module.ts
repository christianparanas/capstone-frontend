import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HotToastModule } from '@ngneat/hot-toast';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from './core/core.module';
import { StudentModule } from './modules/student/student.module';
import { FacultyModule } from './modules/faculty/faculty.module';
import { AdminModule } from './modules/admin/admin.module';

import { environment } from 'src/environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
const BASEURL = environment.baseURL;

const config: SocketIoConfig = { url: BASEURL, options: {} };


import { PushNotificationsModule } from 'ng-push-ivy'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
    StudentModule,
    FacultyModule,
    AdminModule,
    HotToastModule.forRoot(),
    PushNotificationsModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
