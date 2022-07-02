import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
// import {StudentInfoService} from './student-info/student-info.service';
import { TeacherComponent } from './teacher.component';
import { ChartsModule } from 'ng2-charts';


const routes: Routes = [
  {path:'',component:TeacherComponent}

]

@NgModule({
  declarations: [
    TeacherComponent
   
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
