import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
// import {StudentInfoService} from './student-info/student-info.service';
import { ParentMeetingComponent } from './parent-meeting.component';
import { ChartsModule } from 'ng2-charts';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


const routes: Routes = [
  {path:'',component:ParentMeetingComponent}

]

@NgModule({
  declarations: [
    ParentMeetingComponent
   
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
