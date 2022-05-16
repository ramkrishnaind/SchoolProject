import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../student-info/student-info.service';
import * as XLSX from 'xlsx';
import { CommonService } from 'src/app/shared/common.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  willDownload = false;
  form: FormGroup;
  standredData: any;
  studentName;
  studentData;
  standredName;
  divisionData;
  divisionName;
  presentStatus =[{name:"Present",value:'P'},{name:"Absent",value:'A'},{name:"Leave",value:'L'}];
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,private route:Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      date: new FormControl(null,[Validators.required]),
      reasons: new FormControl(null,[Validators.required]),
      idStudent:new FormControl(null,[Validators.required]),
      present:new FormControl(null,[Validators.required])

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
   onChangeDivision(idStandard,idDivision){
    this.studentInfoSerive.getAllStudent(idStandard,idDivision).subscribe(res =>{
      this.studentData = res;
     this.studentName = this.studentData.data;
     });
   }
  makeBody(){
    const body =[{
      idStudent:this.form.get('idStudent').value,
      present:this.form.get('present').value ,   
      date: this.form.get('date').value,
      reasons: this.form.get('reasons').value
     
    }];
    return body;
  }

  attendanceDetails(){
    if(this.form.valid){
    const body = this.makeBody();
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
    this.route.navigate(['/dashboard']);
  }
  
}
