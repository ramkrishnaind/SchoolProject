import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentInfoService } from '../../services/student-info.service';
import {CommonService} from '../../../shared/common.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-examtimetable',
  templateUrl: './add-examtimetable.component.html',
  styleUrls: ['./add-examtimetable.component.scss']
})
export class AddExamtimetableComponent implements OnInit {

  form: FormGroup;
  standardData;
  divisionData;
  subjectData;
  testTypeData;
  minDate:Date;
  maxDate:Date;
  minForEndTime;
  editedExamTimeTableData
  disableEndTime:boolean=true;
  idSchool:number=1;
  attributeData=
    {
      idStandard:'idStandard',
      idDivision:'idDivision',
      idSubject:'idSubject',
      idtestType:'idtestType',
      date:'date',
      startTime:'startTime',
      endTime:'endTime',
}
loading:boolean=false;
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,private router:Router,
    private route :ActivatedRoute) {

      if(this.router.getCurrentNavigation().extras.state != undefined){
        this.editedExamTimeTableData =this.router.getCurrentNavigation().extras.state;
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
//idUnitTest, idStandard, idSubject, idDivision, date, time, idtestType
  ngOnInit(): void {
    this.form = new FormGroup({
      idStandard:new FormControl(null,[Validators.required]),
      idDivision:new FormControl(null,[Validators.required]),
      idSubject:new FormControl(null,[Validators.required]),
      idtestType:new FormControl(null,[Validators.required]),
      date:new FormControl(null,[Validators.required]),
      startTime: new FormControl(null, [Validators.required]),
      endTime: new FormControl(null, [Validators.required]),
      });
    
      this.getAllStandardData();
      this.getTestType();

  }

  getAllStandardData(){
    this.studentInfoSerive.getStandard({idSchool:this.idSchool}).subscribe((res:any) =>{
      this.standardData = res.data;
      if(this.editedExamTimeTableData){
        this.getDivisionData({value:this.editedExamTimeTableData.idStandard},'update');
      }
    });
  }

  getTestType(){
    this.studentInfoSerive.getTestType({idSchool:this.idSchool}).subscribe((res:any) =>{
      this.testTypeData = res.data;
    });
  }
  onChangeStandard(idStandard){
    this.getDivisionData(idStandard,'normal');
   }

   getDivisionData(idStandard,callFor){
    this.studentInfoSerive.getDivision(idStandard,this.idSchool).subscribe((res:any) =>{
      this.divisionData = res.data;
      this.getAllSubjectData(idStandard,callFor);
    });
   }
   getAllSubjectData(idStandard,callFor){
    this.studentInfoSerive.getAllSubject(idStandard.value,this.idSchool).subscribe((res:any) =>{
      this.subjectData = res.data;
      if(callFor === 'update'){
        this.updateValue();
      }
     })
   }

   updateValue(){
   const timeData =this.editedExamTimeTableData.time.split('-');
    this.form.get('idStandard').setValue(this.editedExamTimeTableData.idStandard);
    this.form.get('idDivision').setValue(this.editedExamTimeTableData.idDivision);
    this.form.get('idSubject').setValue(this.editedExamTimeTableData.idSubject);
    this.form.get('idtestType').setValue(this.editedExamTimeTableData.idtestType);
    this.form.get('date').setValue(moment(this.editedExamTimeTableData.date).format('YYYY-MM-DD')); 
    this.form.get('startTime').setValue(timeData[0].trim()); 
    this.form.get('endTime').setValue(timeData[1].trim()); 
    // this.teacherImageDataUploadToS3 = this.editedExamTimeTableData.profileurl;
    // this.form.get('parentName').setValue(this.parentData.name);
  }
   makeBody(){
    const body ={
      idStandard:this.form.get('idStandard').value,
      idDivision:this.form.get('idDivision').value,
      idSubject:this.form.get('idSubject').value,
      idtestType:this.form.get('idtestType').value,
      date: moment(this.form.get('date').value).format('YYYY-MM-DD'),
      time:this.getTime(),
      idSchoolDetails:this.idSchool
};

if(this.editedExamTimeTableData){
  body['idUnitTest'] = this.editedExamTimeTableData.idUnitTest;
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
    this.studentInfoSerive.examTimetable(body).subscribe((res:any) =>{
      if(res){
        this.loading = false;
        if(this.editedExamTimeTableData){
          this.commonService.openSnackbar('Exam Timetable Updated Successfully','Done');
          this.back();
        }
        else{
          this.commonService.openSnackbar('Exam Timetable Added Successfully','Done');
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
    if(this.editedExamTimeTableData){
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
        if(!moment(moment(this.editedExamTimeTableData[key]).format('YYYY-MM-DD')).isSame(moment(this.form.get(this.attributeData[key]).value).format('YYYY-MM-DD'))){
          flag = true;
          break;
        }
      }
      else if (key === 'startTime'){
        if(this.editedExamTimeTableData.time.split('-')[0] != this.form.get(this.attributeData[key]).value){
          flag = true;
          break;
  
        }
      }
      else if(key === 'endTime'){
        if(this.editedExamTimeTableData.time.split('-')[1] != this.form.get(this.attributeData[key]).value){
          flag = true;
          break;
  
        }
      }
      else{
      if(this.editedExamTimeTableData[key] != this.form.get(this.attributeData[key]).value){
        flag = true;
        break;

      }
    }
    };

    return flag;
   }


  setLimitOfEndTimeBasedOnStartTime(data){
    this.minForEndTime=data;
    this.disableEndTime=false;
    this.form.get('endTime').setValue('');
  }
//   uploadResult(){
//  this.router.navigate(['../../examResult'],{relativeTo:this.route});
//   }
  back(){
    this.router.navigate(['../../examTimeTable'],{relativeTo:this.route});
  }


}
