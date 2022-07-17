import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
// import {StudentInfoService} from './student-info/student-info.service';
import { ExamresultComponent } from './examresult.component';
import { ChartsModule } from 'ng2-charts';
import { AddExamresultComponent } from './add-examresult/add-examresult.component';


const routes: Routes = [
  {path:'',component:ExamresultComponent},
  {path:'add-result',component:AddExamresultComponent}

]

@NgModule({
  declarations: [
    ExamresultComponent,
    AddExamresultComponent
   
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
export class ExamresultModule { }
