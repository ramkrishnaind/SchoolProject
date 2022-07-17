import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
// import {StudentInfoService} from './student-info/student-info.service';

import { ChartsModule } from 'ng2-charts';
import { AttendanceListComponent } from './attendance-list.component';
import { UploadAttendanceComponent } from './upload-attendance/upload-attendance.component';


const routes: Routes = [
  {path:'',component:AttendanceListComponent},
  {path:'add-attendance',component:UploadAttendanceComponent}

]

@NgModule({
  declarations: [
    AttendanceListComponent,
    UploadAttendanceComponent
   
  ],
  imports: [
    CommonModule,
    SharedModule,
   // NgxChartsModule,
    HttpClientModule,
    ChartsModule,
    RouterModule.forChild(routes)
  ],
  // providers: [StudentInfoService],
 
})
export class AttendanceModule { }
