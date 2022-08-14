import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../../services/student-info.service';
import * as XLSX from 'xlsx';
import { CommonService } from 'src/app/shared/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from '../../../service/authentication.service';

@Component({
  selector: 'app-upload-attendance',
  templateUrl: './upload-attendance.component.html',
  styleUrls: ['./upload-attendance.component.scss']
})
export class UploadAttendanceComponent implements OnInit {

  @ViewChild('inputFile') inputFile: ElementRef;
  willDownload = false;
  form: FormGroup;
  studentName;
  standardData;
  divisionData;
  minDate:Date;
  maxDate:Date;
  presentStatus =[{name:"Present",value:'P'},{name:"Absent",value:'A'},{name:"Leave",value:'L'}];
  idSchool:number;
  isExcelFile:boolean =false;
fileAdded:string='fileblank';
  selectedFile:File;
  editAttendanceData;
  fileUpload:boolean=false;
  attributeData=
  {
    date:'date',
    idStandard:'idStandard',
    idDivision:'idDivision',
    idStudent:'idStudent',
    present:'present',
    reasons:'reasons',
}
loading:boolean=false;
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,private router:Router,
    private route:ActivatedRoute,private fb: FormBuilder,private iconRegistry: MatIconRegistry,private sanitizer: DomSanitizer,private authservice:AuthenticationService ) {
      
      iconRegistry.addSvgIcon('excel', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/svgIcon/excel.svg'));
      if(this.router.getCurrentNavigation().extras.state != undefined){
        this.idSchool = this.authservice.idSchool;
        this.editAttendanceData =this.router.getCurrentNavigation().extras.state;
        // this.getSpecificHomeworkData();
        
      }
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
      if(this.editAttendanceData){
        this.getDivisionData({value:this.editAttendanceData.standard.idStandard},'update')
      }
    });
  }
  onChangeStandard(idStandard){
    this.getDivisionData(idStandard,'normal');
   }

   getDivisionData(idStandard,callFor){
    this.studentInfoSerive.getDivision(idStandard,this.idSchool).subscribe((res:any) =>{
      if(res.data){
      this.divisionData = res.data;
      this.getAllStudent(this.editAttendanceData.standard.idStandard,{value:this.editAttendanceData.division.idDivision},callFor);
      }
     
    });
   }
   onChangeDivision(idDivision){
     const idStandard = this.form.get('idStandard').value;
    this.getAllStudent(idStandard,idDivision,'normal');
   }

   getAllStudent(idStandard,idDivision,callFor){
    this.studentInfoSerive.getAllStudent(idStandard,idDivision).subscribe((res:any) =>{
      if(res.data){
        this.studentName = res.data;
        if(callFor === 'update'){
           this.updateValue();
        }
      }
     });
   }

   updateValue(){
    this.form.get('date').setValue(moment(this.editAttendanceData.attendance.date).format('YYYY-MM-DD')); 
    this.form.get('idStandard').setValue(this.editAttendanceData.standard.idStandard);
    this.form.get('idDivision').setValue(this.editAttendanceData.division.idDivision);
    this.form.get('idStudent').setValue(this.editAttendanceData.student.idStudent);
    this.form.get('present').setValue(this.editAttendanceData.attendance.present);
    this.form.get('reasons').setValue(this.editAttendanceData.attendance.reasons);
     // this.teacherImageDataUploadToS3 = this.editAttendanceData.profileurl;
     // this.form.get('parentName').setValue(this.parentData.name);
   }
  
   clickToAddFile(){
    document.getElementById('file').click();
   }

  makeBody(){
    const body =[{ 
      date: moment(this.form.get('date').value).format('YYYY-MM-DD'),
      standard: this.studentInfoSerive.getNameBasedonDataAndId(this.standardData,this.form.get('idStandard').value,'idStandard','name'),
      division: this.studentInfoSerive.getNameBasedonDataAndId(this.divisionData,this.form.get('idDivision').value,'idDivision','name'),
      name:this.studentInfoSerive.getNameBasedonDataAndId(this.studentName,this.form.get('idStudent').value,'idStudent','name'),
      present:this.form.get('present').value ,  
      reasons: this.form.get('reasons').value,
    }]; 

    if(this.editAttendanceData){
      body[0]['idAttendance'] = this.editAttendanceData.idAttendance;
     }
    return body;
  }

  attendanceDetails(){
    const data = this.checkDataForUpdate();
    if(data.valid){
      this.loading = true;
    const body = this.makeBody();
    this.studentInfoSerive.attendanceInformation(body).subscribe((res:any) =>{
      if(res){
        this.loading = false;
        if(this.editAttendanceData){
          this.commonService.openSnackbar('Student Attendance Updated Successfully','Done');
          this.back();
        }
        else{
          this.commonService.openSnackbar('Student Attendance added Successfully','Done');
          this.form.reset();
        }
      }
      
    });
  }
  else{
    this.commonService.openSnackbar(data.msg,'Warning');
  }
  }

  buttonSecond(){
    this.attendanceDetails();
   }

  checkDataForUpdate(){
    if(this.editAttendanceData){
      return {msg:'Please,Make changes to Update' ,valid:this.form.valid && this.checkChangeInValueForUpdate()}
    }
    else{
      return {msg:'Please Fill All Field', valid:this.form.valid }
    }
   }

  checkChangeInValueForUpdate(){
    let flag = false;
    const keys = Object.keys(this.attributeData)
    
  
    for (const key in this.attributeData) {
      if(key === 'date'){
        if(!moment(moment(this.editAttendanceData.attendance[key]).format('YYYY-MM-DD')).isSame(moment(this.form.get(this.attributeData[key]).value).format('YYYY-MM-DD'))){
          
          flag = true;
          break;
        }
      }
      else if(key === 'idStandard'){
        if(this.editAttendanceData.standard.idStandard != this.form.get(this.attributeData[key]).value){
          flag = true;
          break;
        }
      }
      else if(key === 'idDivision'){
        if(this.editAttendanceData.division.idDivision != this.form.get(this.attributeData[key]).value){
          flag = true;
          break;
        }
      }
      else if(key === 'idStudent'){
        if(this.editAttendanceData.student.idStudent != this.form.get(this.attributeData[key]).value){
          flag = true;
          break;
        }
      }
      else{
      if(this.editAttendanceData.attendance[key] != this.form.get(this.attributeData[key]).value){
        flag = true;
        break;

      }
    }
    };

    return flag;
   }

  onFileChange(event) {
    this.isExcelFile = !!event.target.files[0].name.match(/(.xls|.xlsx)/);
    if (event.target.files.length > 1 || !this.isExcelFile) {
      this.inputFile.nativeElement.value = '';
      this.fileAdded = 'fileblank';
    }
    else{
      this.selectedFile = event.target.files[0];
      this.upload();
    }
  
  }

  upload(){
    if(this.isExcelFile){
      this.fileUpload = true;
      let workBook = null;
      let jsonData = null;
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary' });
        workBook.SheetNames.forEach(element => {
  
          jsonData = XLSX.utils.sheet_to_json(workBook.Sheets[element]);
          setTimeout(() =>{
            this.studentInfoSerive.attendanceInformation(jsonData).subscribe(res =>{
              this.fileAdded = 'fileupload';
              this.fileUpload = false;
              this.commonService.openSnackbar('Excel Student Attendance Uploaded Successfully','Done');
            });
          },5000);
           }); 
   }
      reader.readAsBinaryString(this.selectedFile);
  }
  }

  downloadFormat(){

  }

  back(){
    this.router.navigate(['../../attendance'],{relativeTo:this.route});
  }
}
