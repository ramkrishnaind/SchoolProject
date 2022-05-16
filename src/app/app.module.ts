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
import { TopNavComponent } from './theme/top-nav/top-nav.component';
import { MenuListItemComponent } from './theme/menu-list-item/menu-list-item.component';
import { PagesComponent } from './pages/pages.component';
import {OtpVerifyComponent} from './authentication/otp-verify/otp-verify.component';

import { NgOtpInputModule } from  'ng-otp-input';
import { ChartsModule } from 'ng2-charts';

import { AppRoutes } from './app-routing';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OtpVerifyComponent,
    ForgetPasswordComponent,
    NotFoundComponent,
    ResetPasswordComponent,
    TopNavComponent,
    MenuListItemComponent,
    PagesComponent
   
    
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    NgOtpInputModule,
   // ChartsModule,
    //RouterModule.forRoot(AppRoutes)
    RouterModule.forRoot(AppRoutes,{useHash:true}),
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
