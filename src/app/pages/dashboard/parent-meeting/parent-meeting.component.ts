import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/shared/common.service';
import { StudentInfoService } from '../student-info/student-info.service';


@Component({
  selector: 'app-parent-meeting',
  templateUrl: './parent-meeting.component.html',
  styleUrls: ['./parent-meeting.component.scss']
})
export class ParentMeetingComponent implements OnInit {
  form: FormGroup;
  standredData;
  standredName;
  divisionData;
  divisionName;
  studentData;
  subjectName;
  subjectData;
  studentName;
  teacherName;
  dataSource;
  teacherData;
  constructor(private route:Router,private studentInfoSerive: StudentInfoService, private commonService: CommonService) { }
//idMeeting, idTeacher, date, meetingTopics, idStandard, idDivision, meetingDescription, startTime, endTime, slotTime
  ngOnInit(): void {
    this.form = new FormGroup({
      idteacher: new FormControl(null, [Validators.required]),
      idStandard: new FormControl(null, [Validators.required]),
      idDivision: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      meetingTopics: new FormControl(null, [Validators.required]),
      meetingDescription: new FormControl(null, [Validators.required]),
      startTime: new FormControl(null, [Validators.required]),
      endTime: new FormControl(null, [Validators.required]),
      slotTime: new FormControl(null, [Validators.required]),
    });
    this.studentInfoSerive.getStandred().subscribe(res => {
      this.standredData = res;
      this.standredName = this.standredData.data;
    });

    this.studentInfoSerive.getAllTechare().subscribe(res => {
      this.teacherData = res;
      this.teacherName = this.teacherData.data;
    });

  }
  back(){
    this.route.navigate(['/dashboard']);
  }


  onChangeStandred(idStandard) {
    this.studentInfoSerive.getDivision(idStandard).subscribe(res => {
      this.divisionData = res;
      this.divisionName = this.divisionData.data;

    });
  }
  onChangeDivision(idStandard) {
    this.studentInfoSerive.getAllSubject(idStandard).subscribe(res => {
      this.subjectData = res;
      this.subjectName = this.studentData.data;
      this.dataSource = new MatTableDataSource(this.subjectName);
    });
  }

 
  // back() {
  //   this.route.navigate(['/dashboard']);
  // }

  makeBody() {
    const body = {
      idStandard: this.form.get('idStandard').value,
      idDivision: this.form.get('idDivision').value,
      date: this.form.get('date').value,
      meetingDescription: this.form.get('meetingDescription').value,
      meetingTopics: this.form.get('meetingTopics').value,
      idTeacher: this.form.get('idteacher').value,
      startTime: this.form.get('startTime').value,
      endTime: this.form.get('endTime').value,
      slotTime: 10
    };
    return body;
  }
  submit() {
    if (this.form.valid) {
      const body = this.makeBody();
      this.studentInfoSerive.meetingDetails(body).subscribe(res => {
        this.commonService.openSnackbar('Meeting Details Submitted Successfully', 'Done');
      });
    }
    else {
      this.commonService.openSnackbar('Please Fill All Field', 'Warning');
    }
  }

}
