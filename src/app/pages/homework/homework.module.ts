import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
// import {StudentInfoService} from './student-info/student-info.service';
import { HomeworkListComponent } from './homework-list.component';
import { ChartsModule } from 'ng2-charts';
import { AddHomeworkComponent } from './add-homework/add-homework.component';


const routes: Routes = [
  {path:'',component:HomeworkListComponent},
  {path:'add-homework',component:AddHomeworkComponent}

]

@NgModule({
  declarations: [
    HomeworkListComponent,
    AddHomeworkComponent
   
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
export class HomeworkModule { }
