import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentInfoService } from '../../services/student-info.service';
import {CommonService} from '../../../shared/common.service';
import * as XLSX from 'xlsx';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-timetable',
  templateUrl: './add-timetable.component.html',
  styleUrls: ['./add-timetable.component.scss']
})
export class AddTimetableComponent implements OnInit {

  @ViewChild('inputFile') inputFile: ElementRef;
  
  form: FormGroup;
  standardData;
  divisionData;
  subjectData;
  minForEndTime;
  disableEndTime:boolean=true;
  idSchool:number=1;
  editTimeTableData
  daysDropDown=[
    {value:'Monday',text:'Monday'},
    {value:'Tuesday',text:'Tuesday'},
    {value:'Wednesday',text:'Wednesday'},
    {value:'Thursday',text:'Thursday'},
    {value:'Friday',text:'Friday'},
    {value:'Saturday',text:'Saturday'},
    {value:'Sunday',text:'Sunday'}
  ]
  attributeData=
  {
    idStandard:'idStandard',
    idDivision:'idDivision',
    idSubject:'idSubject',
    day:'day',
    startTime:'startTime',
    endTime:'endTime',
}
fileAdded:string='fileblank';
  selectedFile:File;
  fileUpload:boolean=false;
  loading:boolean=false;
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,private router:Router,
    private route:ActivatedRoute,private iconRegistry: MatIconRegistry,private sanitizer: DomSanitizer ) {
      iconRegistry.addSvgIcon('excel', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/svgIcon/excel.svg'));
      if(this.router.getCurrentNavigation().extras.state != undefined){
        this.editTimeTableData =this.router.getCurrentNavigation().extras.state;  
      }
     }

  ngOnInit(): void {
    this.form = new FormGroup({
      idStandard:new FormControl(null,[Validators.required]),
      idDivision:new FormControl(null,[Validators.required]),
      idSubject:new FormControl(null,[Validators.required]),
      day:new FormControl(null,[Validators.required]),
      startTime: new FormControl(null, [Validators.required]),
      endTime: new FormControl(null, [Validators.required]),
    });
    this.getStandardData();
  }

  getStandardData(){
    this.studentInfoSerive.getStandard({idSchool:this.idSchool}).subscribe((res:any) =>{
      if(res.data){
      this.standardData = res.data;
      if(this.editTimeTableData){
        this.getDivisionData({value:this.editTimeTableData.idStandard},'update');
      }
    }
    });
  }
  onChangeStandard(idStandard){
     this.getDivisionData(idStandard,'normal');
   }

   getDivisionData(idStandard,callFor){
    this.studentInfoSerive.getDivision(idStandard,this.idSchool).subscribe( (res:any) =>{
      if(res.data){
      this.divisionData = res.data;
      this.getAllSubject(idStandard,callFor);
      }
    });
   }
   getAllSubject(idStandard,callFor){
    this.studentInfoSerive.getAllSubject(idStandard.value,this.idSchool).subscribe((res:any) =>{
      if(res.data){
      this.subjectData = res.data;
      if(callFor === 'update' ){
        this.updateValue();
      }
    }
     })
   }

   updateValue(){
    const timeData =this.editTimeTableData.time.split('-');
     this.form.get('idStandard').setValue(this.editTimeTableData.idStandard);
     this.form.get('idDivision').setValue(this.editTimeTableData.idDivision);
     this.form.get('idSubject').setValue(this.editTimeTableData.idSubject);
     this.form.get('day').setValue(this.editTimeTableData.day.split(','));
     this.form.get('startTime').setValue(timeData[0].trim()); 
     this.form.get('endTime').setValue(timeData[1].trim()); 
     // this.teacherImageDataUploadToS3 = this.editTimeTableData.profileurl;
     // this.form.get('parentName').setValue(this.parentData.name);
   }

   setLimitOfEndTimeBasedOnStartTime(e){
    this.minForEndTime=e;
    this.disableEndTime=false;
    this.form.get('endTime').setValue('');
  }
  
   makeBody(){
    const body =[{
      idStandard:this.form.get('idStandard').value,
      idDivision:this.form.get('idDivision').value,
      idSubject:this.form.get('idSubject').value,
      day:this.form.get('day').value.toString(),
      time:this.getTime(),
      idSchoolDetails:this.idSchool
}];

if(this.editTimeTableData){
  body[0]['idTimetable'] = this.editTimeTableData.idTimetable;
 }
return body;
   }
   getTime(){
    const startTime = this.form.get('startTime').value
    const endTime = this.form.get('endTime').value
    return startTime + "-" + endTime
   }

   buttonSecond(){
    this.submit();
   }

   submit(){
    const data = this.checkDataForUpdate();
     if(data.valid){
      this.loading = true;
    const body = this.makeBody();
    this.studentInfoSerive.timetable(body).subscribe((res:any) =>{//need toverify
      if(res){
        this.loading = false;
        if(this.editTimeTableData){
          this.commonService.openSnackbar('Timetable Updated Successfully','Done');
          this.back();
        }
        else{
          this.commonService.openSnackbar('Timetable Added Successfully','Done');
          this.form.reset();
        }
      }
    });
  }
  else{
    this.commonService.openSnackbar(data.msg,'Warning');
  } 
  }

  checkDataForUpdate(){
    if(this.editTimeTableData){
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
      if (key === 'startTime'){
        if(this.editTimeTableData.time.split('-')[0] != this.form.get(this.attributeData[key]).value){
          flag = true;
          break;
  
        }
      }
      else if(key === 'endTime'){
        if(this.editTimeTableData.time.split('-')[1] != this.form.get(this.attributeData[key]).value){
          flag = true;
          break;
  
        }
      }
      else{
      if(this.editTimeTableData[key] != this.form.get(this.attributeData[key]).value){
        flag = true;
        break;

      }
    }
    };

    return flag;
   }

  
   clickToAddFile(){
    document.getElementById('file').click();
   }


   onFileChange(event) {
    const isExcelFile = !!event.target.files[0].name.match(/(.xls|.xlsx)/);
    if (event.target.files.length > 1 || !isExcelFile) {
      this.inputFile.nativeElement.value = '';
      this.fileAdded = 'fileblank';
    }
    else{
      this.selectedFile = event.target.files[0];
      this.upload();
    }
  
  }

  upload(){
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
            this.studentInfoSerive.timetableBulkUpload(jsonData).subscribe(res =>{
              if(res){
              this.fileAdded = 'fileupload';
              this.fileUpload = false;
              this.commonService.openSnackbar('Time Table Uploaded Successfully','Done');
              }
            });
          },5000);
           }); 
   }
      reader.readAsBinaryString(this.selectedFile);
  }

  downloadFormat(){

  }

  back(){
    this.router.navigate(['../../timetable'],{relativeTo:this.route});
  }

}
