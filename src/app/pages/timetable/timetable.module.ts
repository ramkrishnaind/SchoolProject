import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
// import {StudentInfoService} from './student-info/student-info.service';
import { TimetableListComponent } from './timetable-list.component';
import { ChartsModule } from 'ng2-charts';
import { AddTimetableComponent } from './add-timetable/add-timetable.component';


const routes: Routes = [
  {path:'',component:TimetableListComponent},
  {path:'add-timetable',component:AddTimetableComponent}

]

@NgModule({
  declarations: [
    TimetableListComponent,
    AddTimetableComponent
   
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
export class TimetableModule { }
