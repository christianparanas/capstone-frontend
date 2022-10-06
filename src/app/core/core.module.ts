import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { WebcamModule } from 'ngx-webcam';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../modules/primeng/primeng.module';

import { TokenInterceptor } from './shared/interceptors/token.interceptor';
import { CoreRoutingModule } from './core-routing.module';

import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { WebcamComponent } from './components/webcam/webcam.component';
import { CountdownComponent } from './components/countdown/countdown.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './pages/resetpassword/resetpassword.component';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    WebcamComponent,
    CountdownComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    WebcamModule,
    FormsModule,
    PrimengModule,
    ReactiveFormsModule,
  ],
  exports: [CountdownComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
