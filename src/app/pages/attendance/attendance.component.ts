import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../services/student-info.service';
import * as XLSX from 'xlsx';
import { CommonService } from 'src/app/shared/common.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
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
      reasons: new FormControl(null,[Validators.required]),
    });
    
   this.getStandardData();
  }

  getStandardData(){
    this.studentInfoSerive.getStandred({idSchool:this.idSchool}).subscribe((res:any) =>{
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
      idStudent:this.studentInfoSerive.getNameBasedonDataAndId(this.studentName,this.form.get('idStudent').value,'idStudent','name'),
      present:this.form.get('present').value ,   
      date: this.form.get('date').value,
      reasons: this.form.get('reasons').value,
      idStandard: this.studentInfoSerive.getNameBasedonDataAndId(this.standardData,this.form.get('idStandard').value,'idStandard','name'),
      idDivision: this.studentInfoSerive.getNameBasedonDataAndId(this.divisionData,this.form.get('idDivision').value,'idDivision','name')
     
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

  back(){
    this.router.navigate(['../../dashboard'],{relativeTo:this.route});
  }
  
}
