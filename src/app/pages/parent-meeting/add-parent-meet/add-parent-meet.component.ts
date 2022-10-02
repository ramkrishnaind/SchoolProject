import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/shared/common.service';
import { StudentInfoService } from '../../services/student-info.service';
import * as moment from 'moment';
import { AuthenticationService } from '../../../service/authentication.service';

@Component({
  selector: 'app-add-parent-meet',
  templateUrl: './add-parent-meet.component.html',
  styleUrls: ['./add-parent-meet.component.scss']
})
export class AddParentMeetComponent implements OnInit {

  header = 'Parent Meet Details';
  form: FormGroup;
  standardData;
  teacherData;
  divisionData;
  studentData;
  subjectData;
  dataSource;
  minDate:Date;
  maxDate:Date;
  minForEndTime;
  disableEndTime:boolean=true;
  idSchool:number;
  editParentMeetingData;
  firstTime=true;
  attributeData=
  {
      date:'date',
      idTeacher:'idteacher',
      idStandard:'idStandard',
      idDivision:'idDivision',
      meetingTopics:'meetingTopics',
      meetingDescription:'meetingDescription',
      startTime:'startTime',
      endTime:'endTime',
      slotTime:'slotTime'
}
loading:boolean=false;
  constructor(private router:Router,private studentInfoSerive: StudentInfoService, private commonService: CommonService,
    private route :ActivatedRoute,private authservice:AuthenticationService) { 
      this.idSchool = this.authservice.idSchool;
      if(this.router.getCurrentNavigation().extras.state != undefined){
        this.editParentMeetingData =this.router.getCurrentNavigation().extras.state;
        // this.header = 'Edit Parent Meet Details';
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
//idMeeting, idTeacher, date, meetingTopics, idStandard, idDivision, meetingDescription, startTime, endTime, slotTime
  ngOnInit(): void {
    this.form = new FormGroup({
      date: new FormControl(null, [Validators.required]),
      idteacher: new FormControl(null, [Validators.required]),
      idStandard: new FormControl(null, [Validators.required]),
      idDivision: new FormControl(null, [Validators.required]),
      meetingTopics: new FormControl(null, [Validators.required]),
      meetingDescription: new FormControl(null, [Validators.required]),
      startTime: new FormControl(null, [Validators.required]),
      endTime: new FormControl(null, [Validators.required]),
      slotTime: new FormControl(null, [Validators.required]),
    });
    
    this.getAllTeacher();

  }

  getAllTeacher(){
    this.studentInfoSerive.getAllTeacher().subscribe((res:any) => {
      this.teacherData = res.data;
      this.getStandardData();
    });
  }

  getStandardData(){
    this.studentInfoSerive.getStandard({idSchool:this.idSchool}).subscribe((res:any) =>{
      this.standardData = res.data;
      if(this.editParentMeetingData){
        this.getDivisionData({value:this.editParentMeetingData.idStandard});
      }
      else{
        this.form.get('idStandard').setValue(this.standardData[0].idStandard);
        this.getDivisionData(this.form.get('idStandard'));
      }
    });
  }

  onChangeStandard(idStandard) {
   this.getDivisionData(idStandard);
  }

  getDivisionData(idStandard){
    this.studentInfoSerive.getDivision(idStandard,this.idSchool).subscribe((res:any) => {
      this.divisionData = res.data;
      if(this.editParentMeetingData && this.firstTime){
        this.firstTime =false;
        this.updateValue();
      }
    });
  }

  updateValue(){
    this.form.get('date').setValue(moment(this.editParentMeetingData.date).format('YYYY-MM-DD')); 
    this.form.get('idteacher').setValue(this.editParentMeetingData.idTeacher);
     this.form.get('idStandard').setValue(this.editParentMeetingData.idStandard);
     this.form.get('idDivision').setValue(this.editParentMeetingData.idDivision);
     this.form.get('meetingTopics').setValue(this.editParentMeetingData.meetingTopics);
     this.form.get('meetingDescription').setValue(this.editParentMeetingData.meetingDescription);
     this.form.get('startTime').setValue(this.editParentMeetingData.startTime); 
     this.form.get('endTime').setValue(this.editParentMeetingData.endTime); 
     this.form.get('slotTime').setValue(this.editParentMeetingData.slotTime);
     // this.teacherImageDataUploadToS3 = this.editParentMeetingData.profileurl;
     // this.form.get('parentName').setValue(this.parentData.name);
   }


 
  back(){
    this.router.navigate(['../../parentMeet'],{relativeTo:this.route});
  }

  startClick(e){
    this.minForEndTime=e;
    this.disableEndTime=false;
    this.form.get('endTime').setValue('');
  }

  makeBody() {
    const body = {
      date: moment(this.form.get('date').value).format('YYYY-MM-DD'),
      idTeacher: this.form.get('idteacher').value,
      idStandard: this.form.get('idStandard').value,
      idDivision: this.form.get('idDivision').value,
      meetingDescription: this.form.get('meetingDescription').value,
      meetingTopics: this.form.get('meetingTopics').value,
      startTime: this.form.get('startTime').value,
      endTime: this.form.get('endTime').value,
      slotTime:  this.form.get('slotTime').value
    };

    if(this.editParentMeetingData){//need to verify
      body['idMeeting'] = this.editParentMeetingData.idMeeting;
     }
    return body;
  }

  buttonSecond(){
    this.submit();
   }

  submit() {
    const data = this.checkDataForUpdate();
    if (data.valid) {
      this.loading = true;
      const body = this.makeBody();
      this.studentInfoSerive.meetingDetails(body).subscribe((res:any) =>{
        if(res){
          this.loading = false;
          if(this.editParentMeetingData){
            this.commonService.openSnackbar('Meeting Details Submitted Successfully','Done');
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

  

  checkDataForUpdate(){
    if(this.editParentMeetingData){
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
        if(!moment(moment(this.editParentMeetingData[key]).format('YYYY-MM-DD')).isSame(moment(this.form.get(this.attributeData[key]).value).format('YYYY-MM-DD'))){
          flag = true;
          break;
        }
      }
      else{
      if(this.editParentMeetingData[key] != this.form.get(this.attributeData[key]).value){
        flag = true;
        break;

      }
    }
    };

    return flag;
   }

}
