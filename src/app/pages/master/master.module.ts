import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { ParentComponent } from './parent.component';
import {HttpClientModule} from '@angular/common/http';
import {ParentService} from './parent.service';
import { DivisionComponent } from './division/division.component';
import { SubjectComponent } from './subject/subject.component';
import {StandredComponent} from './standred/standred.component';
import { StudentInfoService } from '../dashboard/student-info/student-info.service';
import { LocationComponent } from './location/location.component';
const routes: Routes = [{
  path:'parent', component:ParentComponent
},
{
  path:'standred',component:StandredComponent
},
{
  path:'division',component:DivisionComponent
},
{
  path:'subject',component:SubjectComponent
},
{
  path:'location',component:LocationComponent
}


]

@NgModule({
  declarations: [ParentComponent, StandredComponent,DivisionComponent, SubjectComponent, LocationComponent],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  providers: [ParentService,StudentInfoService],
 
})
export class MasterModule { }
