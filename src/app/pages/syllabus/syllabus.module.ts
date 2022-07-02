import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
// import {StudentInfoService} from './student-info/student-info.service';
import { SyllabusComponent } from './syllabus.component';
import { ChartsModule } from 'ng2-charts';


const routes: Routes = [
  {path:'',component:SyllabusComponent}

]

@NgModule({
  declarations: [
    SyllabusComponent
   
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
export class SyllabusModule { }
