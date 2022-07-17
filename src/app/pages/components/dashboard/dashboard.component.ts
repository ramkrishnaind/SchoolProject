import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';


export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 500,
  hideDelay: 500,
  touchendHideDelay: 500,
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}
  ],
})
export class DashboardComponent implements OnInit  {
 
  constructor(private router:Router,private route:ActivatedRoute) {
  
  }
  
  ngOnInit(){
    console.log(this.router);
    console.log(this.route);
  }

 
  
  goStudentDetails(){
    this.router.navigate(['../student-details'],{relativeTo:this.route});
  }
  goStudentAttendence(){
    this.router.navigate(['../attendance'],{relativeTo:this.route});
  }
  goHomework(){
    this.router.navigate(['../homework'],{relativeTo:this.route});
  }
  goHoliday(){
    this.router.navigate(['../holiday'],{relativeTo:this.route});
  }
  goSyllabus(){
    this.router.navigate(['../syllabus'],{relativeTo:this.route});
  }
  goExamTimeTable(){
    this.router.navigate(['../examTimeTable'],{relativeTo:this.route});
  }
  goExamResult(){
    this.router.navigate(['../examResult'],{relativeTo:this.route});
  }
  goTimetable(){
    this.router.navigate(['../timetable'],{relativeTo:this.route});
  }
  goFees(){
    this.router.navigate(['../fees'],{relativeTo:this.route});
  }
  goStudentAssignment(){
    this.router.navigate(['../assignment'],{relativeTo:this.route});
  }
  goParentMeet(){
    this.router.navigate(['../parentMeet'],{relativeTo:this.route});
  }
  goTeacher(){
    this.router.navigate(['../teacher-list'],{relativeTo:this.route});
  }

}

