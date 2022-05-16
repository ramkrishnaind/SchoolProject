import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import { Router } from '@angular/router';


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
 
  
  ngOnInit(){
    
    
  }
 
  constructor(private route:Router) {
  
   }
 
  
  goStudentDetails(){
    this.route.navigate(['dashboard/student-details']);
  }
  goStudentAttendence(){
    this.route.navigate(['dashboard/attendance']);
  }
  goHomework(){
    this.route.navigate(['dashboard/homework']);
  }
  goHoliday(){
    this.route.navigate(['dashboard/holiday']);
  }
  goSyllabus(){
    this.route.navigate(['dashboard/syllabus']);
  }
  goExamTimeTable(){
    this.route.navigate(['dashboard/examTimeTable']);
  }
  goTimetable(){
    this.route.navigate(['dashboard/timetable']);
  }
  goFees(){
    this.route.navigate(['dashboard/fees']);
  }
  goStudentAssignment(){
    this.route.navigate(['dashboard/assignment']);
  }
  goParentMeet(){
    this.route.navigate(['dashboard/parentMeet']);
  }
  goTeacher(){
    this.route.navigate(['dashboard/teacher']);
  }

}

