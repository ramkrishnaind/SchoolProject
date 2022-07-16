import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ParentListComponent } from './parent-list.component';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { AddParentDetailComponent } from './add-parent-detail/add-parent-detail.component';

const routes: Routes = [
  {path:'',component:ParentListComponent},
  {path:'add-parent',component:AddParentDetailComponent}

]


@NgModule({
  declarations: [
    ParentListComponent,
    AddParentDetailComponent,
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
export class ParentModule { }
