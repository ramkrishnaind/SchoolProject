import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { ForgetPasswordComponent } from './authentication/forget-password/forget-password.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { PagesComponent } from './pages/pages.component';
import { OtpVerifyComponent } from './authentication/otp-verify/otp-verify.component';



export const AppRoutes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('src/app/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
        data: { title: 'Dashboard' }
      },
      {
        path: 'master',
        loadChildren:() => import('src/app/pages/master/master.module').then(m => m.MasterModule),
        data:{ title: 'Master'}
      }

     ]
  },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'otp', component: OtpVerifyComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '**', component: NotFoundComponent }
];


