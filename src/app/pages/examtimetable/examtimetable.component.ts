import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentInfoService } from '../services/student-info.service';
import {CommonService} from '../../shared/common.service';
import * as moment from 'moment';
@Component({
  selector: 'app-examtimetable',
  templateUrl: './examtimetable.component.html',
  styleUrls: ['./examtimetable.component.scss']
})
export class ExamtimetableComponent implements OnInit {
  form: FormGroup;
  standardData;
  divisionData;
  subjectData;
  testTypeData;
  minDate:Date;
  maxDate:Date;
  minForEndTime;
  disableEndTime:boolean=true;
  idSchool:number=1;
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,private router:Router,
    private route :ActivatedRoute) {
      const currentYear = new Date().getFullYear();
      const m = new Date().getMonth();
      if(m==0 || m==1 || m==2){
        this.minDate = new Date(currentYear-1, 3, 1);
        this.maxDate = new Date(currentYear, 2, 31);
      }
      else{
        this.minDate = new Date(currentYear, 3, 1);
        this.maxDate = new Date(currentYear + 1, 2, 31);
      }
     }
//idUnitTest, idStandard, idSubject, idDivision, date, time, idtestType
  ngOnInit(): void {
    this.form = new FormGroup({
      idStandard:new FormControl(null,[Validators.required]),
      idDivision:new FormControl(null,[Validators.required]),
      idSubject:new FormControl(null,[Validators.required]),
      idtestType:new FormControl(null,[Validators.required]),
      date:new FormControl(null,[Validators.required]),
      startTime: new FormControl(null, [Validators.required]),
      endTime: new FormControl(null, [Validators.required]),
      });
    
      this.getAllStandardData();
      this.getTestType();

  }

  getAllStandardData(){
    this.studentInfoSerive.getStandred({idSchool:this.idSchool}).subscribe((res:any) =>{
      this.standardData = res.data;
    });
  }

  getTestType(){
    this.studentInfoSerive.getTestType({idSchool:this.idSchool}).subscribe((res:any) =>{
      this.testTypeData = res.data;
    });
  }
  onChangeStandred(idStandard){
    this.getDivisionData(idStandard);
    this.getAllSubjectData(idStandard);
   }

   getDivisionData(idStandard){
    this.studentInfoSerive.getDivision(idStandard,this.idSchool).subscribe((res:any) =>{
      this.divisionData = res.data;
    });
   }
   getAllSubjectData(idStandard){
    this.studentInfoSerive.getAllSubject(idStandard.value,this.idSchool).subscribe((res:any) =>{
      this.subjectData = res.data;
     })
   }
   makeBody(){
    const body ={
      idStandard:this.form.get('idStandard').value,
      idDivision:this.form.get('idDivision').value,
      idSubject:this.form.get('idSubject').value,
      idtestType:this.form.get('idtestType').value,
      date: moment(this.form.get('date').value).format('YYYY-MM-DD'),
      time:this.getTime(),
      idSchoolDetails:this.idSchool
};
return body;
   }

   getTime(){
    const startTime = this.form.get('startTime').value
    const endTime = this.form.get('endTime').value
    return startTime + "-" + endTime
   }
   submit(){
     if(this.form.valid){
    const body = this.makeBody();
    this.studentInfoSerive.examTimetable(body).subscribe(res =>{
     this.commonService.openSnackbar('Exam Timetable Submitted Successfully','Done');
     this.form.reset();
     
    });
  }
  else{
    this.commonService.openSnackbar('Please Fill All Field','Warning');
  }
   
  }

  setLimitOfEndTimeBasedOnStartTime(data){
    this.minForEndTime=data;
    this.disableEndTime=false;
    this.form.get('endTime').setValue('');
  }
  uploadResult(){
 this.router.navigate(['../../examResult'],{relativeTo:this.route});
  }
  back(){
    this.router.navigate(['../../dashboard'],{relativeTo:this.route});
  }

}
