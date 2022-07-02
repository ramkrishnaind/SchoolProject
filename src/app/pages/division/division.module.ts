import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DivisionComponent } from './division.component';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

const routes: Routes = [
  {path:'',component:DivisionComponent}

]


@NgModule({
  declarations: [
    DivisionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
   // NgxChartsModule,
    HttpClientModule,
    // ChartsModule,
    RouterModule.forChild(routes)
  ]
})
export class DivisionModule { }
