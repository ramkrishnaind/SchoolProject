import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
// import {StudentInfoService} from './student-info/student-info.service';
import { ParentMeetingListComponent } from './parent-meeting-list.component';
import { ChartsModule } from 'ng2-charts';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AddParentMeetComponent } from './add-parent-meet/add-parent-meet.component';


const routes: Routes = [
  {path:'',component:ParentMeetingListComponent},
  {path :'add-parent-meet',component:AddParentMeetComponent}

]

@NgModule({
  declarations: [
    ParentMeetingListComponent,
    AddParentMeetComponent
   
  ],
  imports: [
    CommonModule,
    SharedModule,
   // NgxChartsModule,
    HttpClientModule,
    ChartsModule,
    NgxMaterialTimepickerModule,
    RouterModule.forChild(routes)
  ],
  // providers: [StudentInfoService],
 
})
export class ParentMeetingModule { }
