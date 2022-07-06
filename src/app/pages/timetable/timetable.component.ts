import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentInfoService } from '../services/student-info.service';
import {CommonService} from '../../shared/common.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {
  form: FormGroup;
  standardData;
  divisionData;
  subjectData;
  idSchool:number=1;
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,private router:Router,
    private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      idStandard:new FormControl(null,[Validators.required]),
      idDivision:new FormControl(null,[Validators.required]),
      idSubject:new FormControl(null,[Validators.required]),
      day:new FormControl(null,[Validators.required]),
      time:new FormControl(null,[Validators.required]),
    });
    this.getStandardData();
  }

  getStandardData(){
    this.studentInfoSerive.getStandred({idSchool:this.idSchool}).subscribe((res:any) =>{
      this.standardData = res.data;
    });
  }
  onChangeStandred(idStandard){
     this.getDivisionData(idStandard);
     this.getAllSubject(idStandard);
   }

   getDivisionData(idStandard){
    this.studentInfoSerive.getDivision(idStandard,this.idSchool).subscribe( (res:any) =>{
      this.divisionData = res.data;
    });
   }
   getAllSubject(idStandard){
    this.studentInfoSerive.getAllSubject(idStandard.value,this.idSchool).subscribe((res:any) =>{
      this.subjectData = res.data;
     })
   }
  
   makeBody(){
    const body =[{
      idStandard:this.form.get('idStandard').value,
      idDivision:this.form.get('idDivision').value,
      idSubject:this.form.get('idSubject').value,
      day:this.form.get('day').value,
      time:this.form.get('time').value,
      idSchoolDetails:this.idSchool

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
    this.router.navigate(['../../dashboard'],{relativeTo:this.route});
  }

}
