import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentInfoService } from '../student-info/student-info.service';
import {CommonService} from './../../../shared/common.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-examresult',
  templateUrl: './examresult.component.html',
  styleUrls: ['./examresult.component.scss']
})
export class ExamresultComponent implements OnInit {
  form: FormGroup;
  standredData;
  standredName;
  divisionData;
  divisionName;
  subjectData;
  subjectName;
  testTypeData;
  testTypeName;
  studentName;
  studentData;
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,private route:Router) { }



 

  ngOnInit(): void {
    this.form = new FormGroup({
      idStandard:new FormControl(null,[Validators.required]),
      idDivision:new FormControl(null,[Validators.required]),
      idSubject:new FormControl(null,[Validators.required]),
      idtestType:new FormControl(null,[Validators.required]),
      idStudent:new FormControl(null,[Validators.required]),
      obtain:new FormControl(null,[Validators.required]),
      min:new FormControl(null,[Validators.required]),
      max:new FormControl(null,[Validators.required]),
      remark:new FormControl(null,[Validators.required]),
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
   onChangeDivision(idStandard,idDivision){
    this.studentInfoSerive.getAllStudent(idStandard,idDivision).subscribe(res =>{
      this.studentData = res;
     this.studentName = this.studentData.data;
     });
   }
   makeBody(){
    const body =[{
      idStandard:this.form.get('idStandard').value,
      idDivision:this.form.get('idDivision').value,
      idSubject:this.form.get('idSubject').value,
      idtestType:this.form.get('idtestType').value,
      idStudent:this.form.get('idStudent').value,
      obtain:this.form.get('obtain').value,
      min:this.form.get('min').value,
      max:this.form.get('max').value,
      remark:this.form.get('remark').value
}];
return body;
   }
   submit(){
     if(this.form.valid){
    const body = this.makeBody();
    this.studentInfoSerive.result(body).subscribe(res =>{
     this.commonService.openSnackbar('Result Submitted Successfully','Done');
     this.form.reset();
     
    });
  }
  else{
    this.commonService.openSnackbar('Please Fill All Field','Warning');
  }
   
  }
  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      workBook.SheetNames.forEach(element => {
        jsonData = XLSX.utils.sheet_to_json(workBook.Sheets[element])
        console.log("upload ExcelDATa:::::::::::",element);
        this.studentInfoSerive.result(jsonData).subscribe(res =>{
          console.log("upload Excel:::::::::::",res);
          this.commonService.openSnackbar('Upload Result Excel File Successfully','Done');
        })
         });
        
        
 }
    reader.readAsBinaryString(file);
  }
  back(){
    this.route.navigate(['/dashboard']);
  }

}
