import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
// import {StudentInfoService} from './student-info/student-info.service';
import { TeacherListComponent } from './teacher-list.component';
import { ChartsModule } from 'ng2-charts';
import { AddTeacherRecordComponent } from './add-teacher-record/add-teacher-record.component';


const routes: Routes = [
  {path:'',component:TeacherListComponent},
  {path:'add-teacher',component:AddTeacherRecordComponent}

]

@NgModule({
  declarations: [
    TeacherListComponent,
    AddTeacherRecordComponent
   
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
export class TeacherModule { }
