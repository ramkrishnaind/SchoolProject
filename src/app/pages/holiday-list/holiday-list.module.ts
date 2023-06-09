import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
// import {StudentInfoService} from './student-info/student-info.service';
import { HolidayListComponent } from './holiday-list.component';
import { ChartsModule } from 'ng2-charts';


const routes: Routes = [
  {path:'',component:HolidayListComponent}

]

@NgModule({
  declarations: [
    HolidayListComponent
   
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
export class HolidayListModule { }
