import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../services/student-info.service';
import * as XLSX from 'xlsx';
import { CommonService } from 'src/app/shared/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  @ViewChild('inputFile') inputFile: ElementRef;
  willDownload = false;
  form: FormGroup;
  studentName;
  standardData;
  divisionData;
  minDate:Date;
  maxDate:Date;
  presentStatus =[{name:"Present",value:'P'},{name:"Absent",value:'A'},{name:"Leave",value:'L'}];
  idSchool:number=1;

  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,private router:Router,
    private route:ActivatedRoute,private fb: FormBuilder ) { 
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

  ngOnInit(): void {
    this.form = this.fb.group({
      date: new FormControl(null,[Validators.required]),
      idStandard:new FormControl(null, [Validators.required]),
      idDivision:new FormControl(null, [Validators.required]),
      idStudent:new FormControl(null,[Validators.required]),
      present:new FormControl(null,[Validators.required]),
      reasons: new FormControl('',),
    });
    
   this.getStandardData();
  }

  getStandardData(){
    this.studentInfoSerive.getStandard({idSchool:this.idSchool}).subscribe((res:any) =>{
      this.standardData = res.data;
    });
  }
  onChangeStandard(idStandard){
    this.studentInfoSerive.getDivision(idStandard,this.idSchool).subscribe((res:any) =>{
      this.divisionData = res.data;
     
    });
   }
   onChangeDivision(idDivision){
    const idStandard = this.form.get('idStandard').value;
    this.studentInfoSerive.getAllStudent(idStandard,idDivision).subscribe((res:any) =>{
     this.studentName = res.data;
     });
   }

  makeBody(){
    const body =[{ 
      date: moment(this.form.get('date').value).format('YYYY-MM-DD'),
      standard: this.studentInfoSerive.getNameBasedonDataAndId(this.standardData,this.form.get('idStandard').value,'idStandard','name'),
      division: this.studentInfoSerive.getNameBasedonDataAndId(this.divisionData,this.form.get('idDivision').value,'idDivision','name'),
      name:this.studentInfoSerive.getNameBasedonDataAndId(this.studentName,this.form.get('idStudent').value,'idStudent','name'),
      present:this.form.get('present').value ,  
      reason: this.form.get('reasons').value,
    }]; 
    return body;
  }

  attendanceDetails(){
    if(this.form.valid){
    const body = this.makeBody();
    console.log(body);
    this.studentInfoSerive.attendanceInformation(body).subscribe(res =>{
      this.commonService.openSnackbar('Student Attendance Submitted Successfully','Done');
      this.form.reset();
    });
  }
  else{
    this.commonService.openSnackbar('Please Fill All Field','Warning');
  }
  }
  onFileChange(event) {
    const isExcelFile = !!event.target.files[0].name.match(/(.xls|.xlsx)/);
    if (event.target.files.length > 1 || !isExcelFile) {
      this.inputFile.nativeElement.value = '';
    }
    if(isExcelFile){
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      workBook.SheetNames.forEach(element => {

        jsonData = XLSX.utils.sheet_to_json(workBook.Sheets[element])
        this.commonService.openSnackbar('Upload Excel file Successfully........','Done');
        setTimeout(() =>{
          this.studentInfoSerive.attendanceInformation(jsonData).subscribe(res =>{
            this.commonService.openSnackbar('Excel Student Attendance Uploaded Successfully','Done');
          });
        },5000);
         }); 
 }
    reader.readAsBinaryString(file);
}
  }

  back(){
    this.router.navigate(['../../dashboard'],{relativeTo:this.route});
  }
  
}
