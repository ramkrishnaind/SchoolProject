import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentInfoService } from '../services/student-info.service';
import {CommonService} from '../../shared/common.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {

  @ViewChild('inputFile') inputFile: ElementRef;
  
  form: FormGroup;
  standardData;
  divisionData;
  subjectData;
  minForEndTime;
  disableEndTime:boolean=true;
  idSchool:number=1;
  daysDropDown=[
    {value:'Monday',text:'Monday'},
    {value:'Tuesday',text:'Tuesday'},
    {value:'Wednesday',text:'Wednesday'},
    {value:'Thursday',text:'Thursday'},
    {value:'Friday',text:'Friday'},
    {value:'Saturday',text:'Saturday'},
    {value:'Sunday',text:'Sunday'}
  ]
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,private router:Router,
    private route:ActivatedRoute) { }

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
      this.standardData = res.data;
    });
  }
  onChangeStandard(idStandard){
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
return body;
   }
   getTime(){
    const startTime = this.form.get('startTime').value
    const endTime = this.form.get('endTime').value
    return startTime + "-" + endTime
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

  onExcelUpload(event){
    const isExcelFile = !!event.target.files[0].name.match(/(.xls|.xlsx)/);
    if (event.target.files.length > 1 || !isExcelFile) {
      this.inputFile.nativeElement.value = '';
    }
    if(isExcelFile){
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = (eve) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      workBook.SheetNames.forEach(element => {
        jsonData = XLSX.utils.sheet_to_json(workBook.Sheets[element])
        setTimeout(() =>{
          this.studentInfoSerive.timetableBulkUpload(jsonData).subscribe(res =>{
            this.commonService.openSnackbar('TimeTable of Student Attendance Uploaded Successfully','Done');
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
