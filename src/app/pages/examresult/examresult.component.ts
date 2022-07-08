import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentInfoService } from '../services/student-info.service';
import {CommonService} from '../../shared/common.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-examresult',
  templateUrl: './examresult.component.html',
  styleUrls: ['./examresult.component.scss']
})
export class ExamresultComponent implements OnInit {

  @ViewChild('inputFile') inputFile: ElementRef;
  
  form: FormGroup;
  standardData;
  divisionData;
  subjectData;
  testTypeData;
  studentData;
  idSchool:number=1;
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,private router:Router,
    private route :ActivatedRoute) { }
 

  ngOnInit(): void {
    this.form = new FormGroup({
      idStandard:new FormControl(null,[Validators.required]),
      idDivision:new FormControl(null,[Validators.required]),
      idSubject:new FormControl(null,[Validators.required]),
      idtestType:new FormControl(null,[Validators.required]),
      idStudent:new FormControl(null,[Validators.required]),
      obtain:new FormControl(null,[Validators.required,Validators.pattern("^[0-9]*$")]),
      min:new FormControl(null,[Validators.required,Validators.pattern("^[0-9]*$")]),
      max:new FormControl(null,[Validators.required,Validators.pattern("^[0-9]*$")]),
      remark:new FormControl(null,[Validators.required]),
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
    this.studentInfoSerive.getTestType().subscribe((res:any) =>{
      this.testTypeData = res.data;
    });
  }
  onChangeStandard(idStandard){
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
   onChangeDivision(idDivision){
    const idStandardValue = this.form.get('idStandard').value;
    this.studentInfoSerive.getAllStudent(idStandardValue,idDivision).subscribe((res:any) =>{
      this.studentData = res.data;
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
    console.log(ev);
    const isExcelFile = !!ev.target.files[0].name.match(/(.xls|.xlsx)/);
    if (ev.target.files.length > 1 || !isExcelFile) {
      this.inputFile.nativeElement.value = '';
    }
    if(isExcelFile){
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
  }
  back(){
    // this.route.navigate(['/dashboard']);
    this.router.navigate(['../../dashboard'],{relativeTo:this.route});
  }

}
