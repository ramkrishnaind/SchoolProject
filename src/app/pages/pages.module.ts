import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import { PagesComponent } from './pages.component';
import { MenuListItemComponent } from './theme/menu-list-item/menu-list-item.component';
import { TopNavComponent } from './theme/top-nav/top-nav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PagesRoutingModule }  from './pages-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { LogoutPopupComponent } from './components/logout-popup/logout-popup.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TeacherLinkListComponent } from './components/teacher-link/teacher-link-list.component';
import { AddTeacherLinkComponent } from './components/add-teacher-link/add-teacher-link.component';


@NgModule({
  declarations: [
    PagesComponent,
    MenuListItemComponent,
    TopNavComponent,
    DashboardComponent,
    ProfileComponent,
    LogoutPopupComponent,
    TeacherLinkListComponent,
    AddTeacherLinkComponent,

   
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
