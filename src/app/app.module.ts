import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './authentication/login/login.component';

import { ForgetPasswordComponent } from './authentication/forget-password/forget-password.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { SharedModule } from './shared/shared.module';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import {OtpVerifyComponent} from './authentication/otp-verify/otp-verify.component';

import { NgOtpInputModule } from  'ng-otp-input';
import { ChartsModule } from 'ng2-charts';

import {JwtInterceptor} from './helpers/jwt.interceptor';
import {ErrorInterceptor} from './helpers/error.interceptor';

import { AppRoutes } from './app-routing';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OtpVerifyComponent,
    ForgetPasswordComponent,
    NotFoundComponent,
    ResetPasswordComponent,
   
    
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    NgOtpInputModule,
   // ChartsModule,
    //RouterModule.forRoot(AppRoutes)
    RouterModule.forRoot(AppRoutes),
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [
    // { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
