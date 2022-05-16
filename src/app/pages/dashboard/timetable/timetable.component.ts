import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentInfoService } from '../student-info/student-info.service';
import {CommonService} from './../../../shared/common.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {
  form: FormGroup;
  standredData;
  standredName;
  divisionData;
  divisionName;
  subjectData;
  subjectName;
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,private route:Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      idStandard:new FormControl(null,[Validators.required]),
      idDivision:new FormControl(null,[Validators.required]),
      idSubject:new FormControl(null,[Validators.required]),
      day:new FormControl(null,[Validators.required]),
      time:new FormControl(null,[Validators.required]),
    });
    this.studentInfoSerive.getStandred().subscribe(res =>{
      this.standredData = res;
      this.standredName = this.standredData.data;
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
    const body =[{
      idStandard:this.form.get('idStandard').value,
      idDivision:this.form.get('idDivision').value,
      idSubject:this.form.get('idSubject').value,
      day:this.form.get('day').value,
      time:this.form.get('time').value

}];
return body;
   }
   submit(){
     if(this.form.valid){
    const body = this.makeBody();
    this.studentInfoSerive.timetable(body).subscribe(res =>{
     this.commonService.openSnackbar('School Timetable Submitted Successfully','Done');
     this.form.reset();
     
    });
  }
  else{
    this.commonService.openSnackbar('Please Fill All Field','Warning');
  }
   
  }
  back(){
    this.route.navigate(['/dashboard']);
  }

}
