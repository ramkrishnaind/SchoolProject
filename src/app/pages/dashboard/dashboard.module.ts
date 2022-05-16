import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard.component'
import { ChartsModule } from 'ng2-charts';
import { StudentInfoComponent } from './student-info/student-info.component';
import {StudentInfoService} from './student-info/student-info.service';
import { AttendanceComponent } from './attendance/attendance.component';
import { HomeworkComponent } from './homework/homework.component';
import { HolidayListComponent } from './holiday-list/holiday-list.component';
import { SyllabusComponent } from './syllabus/syllabus.component';
import { ExamtimetableComponent } from './examtimetable/examtimetable.component';
import { ExamresultComponent } from './examresult/examresult.component';
import { TimetableComponent } from './timetable/timetable.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { StudentInfoPopupComponent } from './student-info-popup/student-info-popup.component';
import { FeesComponent } from './fees/fees.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { ParentMeetingComponent } from './parent-meeting/parent-meeting.component';
import { TeacherComponent } from './teacher/teacher.component';


const routes: Routes = [{
  path:'', component:DashboardComponent
},
{
  path:'student',component:StudentInfoComponent
},
{
  path:'student-details',component:StudentDetailsComponent
},
{
  path:'attendance',component:AttendanceComponent
},
{
  path:'homework',component:HomeworkComponent
},
{
  path:'holiday',component:HolidayListComponent
},
{
  path:'syllabus',component:SyllabusComponent
},
{
  path:'examTimeTable',component:ExamtimetableComponent
},
{
  path:'examResult',component:ExamresultComponent
},
{
  path:'timetable',component:TimetableComponent
},
{
  path:'StudentInfoPopup',component:StudentInfoPopupComponent
},
{
  path:'fees',component:FeesComponent
},
{
  path:'assignment',component:AssignmentComponent
},
{
  path:'parentMeet',component:ParentMeetingComponent
},
{
  path:'teacher',component:TeacherComponent
}

]

@NgModule({
  declarations: [
    DashboardComponent,
    StudentInfoComponent,
    AttendanceComponent,
    HomeworkComponent,
    HolidayListComponent,
    SyllabusComponent,
    ExamtimetableComponent,
    ExamresultComponent,
    TimetableComponent,
    StudentDetailsComponent,
    StudentInfoPopupComponent,
    FeesComponent,
    AssignmentComponent,
    ParentMeetingComponent,
    TeacherComponent,
   
  ],
  imports: [
    CommonModule,
    SharedModule,
   // NgxChartsModule,
    HttpClientModule,
    ChartsModule,
    RouterModule.forChild(routes)
  ],
  providers: [StudentInfoService],
 
})
export class DashboardModule { }
