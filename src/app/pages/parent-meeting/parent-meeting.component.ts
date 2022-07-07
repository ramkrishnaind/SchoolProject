import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/shared/common.service';
import { StudentInfoService } from '../services/student-info.service';
import * as moment from 'moment';


@Component({
  selector: 'app-parent-meeting',
  templateUrl: './parent-meeting.component.html',
  styleUrls: ['./parent-meeting.component.scss']
})
export class ParentMeetingComponent implements OnInit {
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
  idSchool:number=1;
  constructor(private router:Router,private studentInfoSerive: StudentInfoService, private commonService: CommonService,
    private route :ActivatedRoute) { 
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
    
    this.getStandardData();
    this.getAllTeacher();

  }

  getStandardData(){
    this.studentInfoSerive.getStandred({idSchool:this.idSchool}).subscribe((res:any) =>{
      this.standardData = res.data;
    });
  }

  getAllTeacher(){
    this.studentInfoSerive.getAllTeacher().subscribe((res:any) => {
      this.teacherData = res.data;
    });
  }
  back(){
    this.router.navigate(['../../dashboard'],{relativeTo:this.route});
  }


  onChangeStandard(idStandard) {
    this.studentInfoSerive.getDivision(idStandard,this.idSchool).subscribe((res:any) => {
      this.divisionData = res.data;

    });
  }
  // onChangeDivision(idStandard) {
  //   this.studentInfoSerive.getAllSubject(idStandard).subscribe((res:any) => {
  //     this.subjectData = res;
  //     this.subjectName = this.studentData.data;
  //     this.dataSource = new MatTableDataSource(this.subjectName);
  //   });
  // }
  startClick(e){
    this.minForEndTime=e;
    this.disableEndTime=false;
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
    return body;
  }
  submit() {
    console.log(this.form);
    if (this.form.valid) {
      const body = this.makeBody();
      this.studentInfoSerive.meetingDetails(body).subscribe((res:any) => {
        if(res.data === 'saved'){
          this.commonService.openSnackbar('Meeting Details Submitted Successfully', 'Done');
          this.form.reset();
        }
      });
    }
    else {
      this.commonService.openSnackbar('Please Fill All Field', 'Warning');
    }
  }

}
