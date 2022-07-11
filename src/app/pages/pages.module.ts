import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { MenuListItemComponent } from './theme/menu-list-item/menu-list-item.component';
import { TopNavComponent } from './theme/top-nav/top-nav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { PagesRoutingModule }  from './pages-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { LogoutPopupComponent } from './components/logout-popup/logout-popup.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TeacherLinkComponent } from './components/teacher-link/teacher-link.component';


// const routes: Routes = [
//   {
//       path: '',
//       component: PagesComponent,
//       children: [
//         {
//           path:'dashboard', component:DashboardComponent
//         },
//         {
//           path:'attendance',
//           loadChildren: () => import('src/app/pages/attendance/attendance.module').then(m => m.AttendanceModule),
//         },
//         // {
//         //   path: 'dashboard',
//         //   loadChildren: () => import('src/app/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
//         //   data: { title: 'Dashboard' }
//         // },
//         {
//           path: 'master/parent',
//           loadChildren:() => import('src/app/pages/parent/parent.module').then(m => m.ParentModule),
//           data:{ title: 'Master'}
//         },
//         {
//           path: 'master/standard',
//           loadChildren:() => import('src/app/pages/standard/standard.module').then(m => m.StandardModule),
//           data:{ title: 'Master'}
//         },
//         {
//           path: 'master/division',
//           loadChildren:() => import('src/app/pages/division/division.module').then(m => m.DivisionModule),
//           data:{ title: 'Master'}
//         },
//         {
//           path: 'master/subject',
//           loadChildren:() => import('src/app/pages/subject/subject.module').then(m => m.SubjectModule),
//           data:{ title: 'Master'}
//         },
//         {
//           path: 'master/location',
//           loadChildren:() => import('src/app/pages/location/location.module').then(m => m.LocationModule),
//           data:{ title: 'Master'}
//         },
  
//        ]
//     },

// ]

@NgModule({
  declarations: [
    PagesComponent,
    MenuListItemComponent,
    TopNavComponent,
    DashboardComponent,
    ProfileComponent,
    LogoutPopupComponent,
    TeacherLinkComponent,

   
  ],
  imports: [
    CommonModule,
    SharedModule,
   // NgxChartsModule,
    HttpClientModule,
    PagesRoutingModule,
    NgxMaterialTimepickerModule
    // RouterModule.forChild(routes)
  ],
 
})
export class PagesModule { }
