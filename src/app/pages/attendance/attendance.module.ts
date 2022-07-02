import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
// import {StudentInfoService} from './student-info/student-info.service';
import { AttendanceComponent } from './attendance.component';
import { ChartsModule } from 'ng2-charts';


const routes: Routes = [
  {path:'',component:AttendanceComponent}

]

@NgModule({
  declarations: [
    AttendanceComponent
   
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
