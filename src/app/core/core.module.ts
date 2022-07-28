import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {WebcamModule} from 'ngx-webcam';
import {FormsModule} from '@angular/forms';

import { TokenInterceptor } from './shared/interceptors/token.interceptor';
import { CoreRoutingModule } from './core-routing.module';

import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';



@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [CommonModule, CoreRoutingModule, WebcamModule, FormsModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {}
