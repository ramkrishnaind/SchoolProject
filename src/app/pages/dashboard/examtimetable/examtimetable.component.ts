import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentInfoService } from '../student-info/student-info.service';
import {CommonService} from './../../../shared/common.service';
@Component({
  selector: 'app-examtimetable',
  templateUrl: './examtimetable.component.html',
  styleUrls: ['./examtimetable.component.scss']
})
export class ExamtimetableComponent implements OnInit {
  form: FormGroup;
  standredData;
  standredName;
  divisionData;
  divisionName;
  subjectData;
  subjectName;
  testTypeData;
  testTypeName;
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,private route:Router) { }
//idUnitTest, idStandard, idSubject, idDivision, date, time, idtestType
  ngOnInit(): void {
    this.form = new FormGroup({
      idStandard:new FormControl(null,[Validators.required]),
      idDivision:new FormControl(null,[Validators.required]),
      idSubject:new FormControl(null,[Validators.required]),
      idtestType:new FormControl(null,[Validators.required]),
      date:new FormControl(null,[Validators.required]),
      time:new FormControl(null,[Validators.required])
      });
    this.studentInfoSerive.getStandred().subscribe(res =>{
      this.standredData = res;
      this.standredName = this.standredData.data;
    });
    this.studentInfoSerive.getTestType().subscribe(res =>{
      this.testTypeData = res;
      this.testTypeName = this.testTypeData.data;
    });
  }
  onChangeStandred(idStandard){
    
    this.studentInfoSerive.getDivision(idStandard).subscribe( res =>{
      this.divisionData = res;
      this.divisionName = this.divisionData.data;
     
    });
   }
   onChangeStandredForSubject(idStandard){
     this.studentInfoSerive.getAllSubject(idStandard).subscribe(res =>{
      this.subjectData = res;
      this.subjectName = this.subjectData.data;
     })
   }
   makeBody(){
    const body ={
      idStandard:this.form.get('idStandard').value,
      idDivision:this.form.get('idDivision').value,
      idSubject:this.form.get('idSubject').value,
      idtestType:this.form.get('idtestType').value,
      date:this.form.get('date').value,
      time:this.form.get('time').value
};
return body;
   }
   submit(){
     if(this.form.valid){
    const body = this.makeBody();
    this.studentInfoSerive.examTimetable(body).subscribe(res =>{
     this.commonService.openSnackbar('Syllabus Submitted Successfully','Done');
     
    });
  }
  else{
    this.commonService.openSnackbar('Please Fill All Field','Warning');
  }
   
  }
  uploadResult(){
 this.route.navigate(['dashboard/examResult']);
  }
  back(){
    this.route.navigate(['/dashboard']);
  }

}
