import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentInfoService } from '../services/student-info.service';
import {CommonService} from '../../shared/common.service';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-syllabus',
  templateUrl: './syllabus.component.html',
  styleUrls: ['./syllabus.component.scss']
})
export class SyllabusComponent implements OnInit {
  form: FormGroup;
  standardData;
  standardName;
  divisionData;
  divisionName;
  subjectData;
  subjectName;
  testTypeData;
  testTypeName;
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,
    private router:Router,private route:ActivatedRoute,private authservice:AuthenticationService) { }
 
  ngOnInit(): void {
    this.form = new FormGroup({
      idStandard:new FormControl(null,[Validators.required]),
      idDivision:new FormControl(null,[Validators.required]),
      idSubject:new FormControl(null,[Validators.required]),
      type:new FormControl(null,[Validators.required]),
      marks:new FormControl(null,[Validators.required]),
      chapters:new FormControl(null,[Validators.required])
      });
    this.studentInfoSerive.getStandard({idSchool:this.authservice.idSchool}).subscribe(res =>{
      this.standardData = res;
      this.standardName = this.standardData.data;
    });
    this.studentInfoSerive.getTestType({idSchool:this.authservice.idSchool}).subscribe(res =>{
      this.testTypeData = res;
      this.testTypeName = this.testTypeData.data;
    });

  }
  onChangeStandard(idStandard){
    
    this.studentInfoSerive.getDivision(idStandard).subscribe( res =>{
      this.divisionData = res;
      this.divisionName = this.divisionData.data;
     
    });
   }
   onChangeStandardForSubject(idStandard){
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
      type:this.form.get('type').value,
      marks:this.form.get('marks').value,
      chapters:this.form.get('chapters').value
}];
return body;
   }
   submit(){
     if(this.form.valid){
    const body = this.makeBody();
    this.studentInfoSerive.syllabus(body).subscribe(res =>{
     this.commonService.openSnackbar('Syllabus Submitted Successfully','Done');
     
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
