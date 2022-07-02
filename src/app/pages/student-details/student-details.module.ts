import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
// import {StudentInfoService} from './student-info/student-info.service';
import { StudentDetailsComponent } from './student-details.component';
import { StudentInfoPopupComponent } from './student-info-popup/student-info-popup.component';
import { StudentInfoComponent } from './student-info/student-info.component';
import { ChartsModule } from 'ng2-charts';


const routes: Routes = [
  {path:'',component:StudentDetailsComponent},
  {path:'student',component:StudentInfoComponent},
  {path:'StudentInfoPopup',component:StudentInfoPopupComponent}

]

@NgModule({
  declarations: [
    StudentDetailsComponent,
    StudentInfoPopupComponent,
    StudentInfoComponent,
   
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
export class StudentDetailsModule { }
