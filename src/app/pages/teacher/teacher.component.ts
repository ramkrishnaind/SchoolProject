import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';
import { StudentInfoService } from '../services/student-info.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
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
  EMAIL = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$";
  constructor(private studentInfoSerive: StudentInfoService, private commonService: CommonService, private router: Router,
    private route:ActivatedRoute) { }

  ngOnInit(): void {


    this.form = new FormGroup({
      businessLogo: new FormControl(null, [Validators.required]),
      businessLogoUrl: new FormControl(null, [Validators.required]),
      idteacher: new FormControl(null, [Validators.required]),
      teacher: new FormControl(null, [Validators.required]),
      idStandard: new FormControl(null, [Validators.required]),
      idDivision: new FormControl(null, [Validators.required]),
      idSubject: new FormControl(null, [Validators.required]),
      email:new FormControl(null, [Validators.required,Validators.pattern(this.EMAIL)]),
      semail:new FormControl(null, [Validators.required,Validators.pattern(this.EMAIL)]),
      whatsappNumber:new FormControl(null, [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10),Validators.minLength(10)]),
      phoneNumber:new FormControl(null, [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10),,Validators.minLength(10)]),

    });
    this.studentInfoSerive.getStandred({idSchool:1}).subscribe(res => {
      this.standredData = res;
      this.standredName = this.standredData.data;
    });

    this.studentInfoSerive.getAllTeacher().subscribe(res => {
      this.teacherData = res;
      this.teacherName = this.teacherData.data;
    });
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


  //   this.studentInfoSerive.getTestType().subscribe(res =>{
  //     this.testTypeData = res;
  //     this.testTypeName = this.testTypeData.data;
  //   });
  // }
  selectFile(event){

  }

  handleFileInput(event){

  }

  upload(){

  }
  back() {
    this.router.navigate(['../../dashboard'],{relativeTo:this.route});
  }

  makeBody() {
    const body = [{
      idStandard: this.form.get('idStandard').value,
      idDivision: this.form.get('idDivision').value,
      idSubject: this.form.get('idSubject').value,
      idTeacher: this.form.get('idteacher').value,
    }];
    return body;
  }
  submit() {
    if (this.form.valid) {
      const body = this.makeBody();
      this.studentInfoSerive.teacherDetails(body).subscribe(res => {
        this.commonService.openSnackbar('Teacher Details Submitted Successfully', 'Done');
      });
    }
    else {
      this.commonService.openSnackbar('Please Fill All Field', 'Warning');
    }
  }

  onFileChange(event){

  }
}