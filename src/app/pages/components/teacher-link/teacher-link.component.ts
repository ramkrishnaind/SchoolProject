import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';
import { StudentInfoService } from '../../services/student-info.service';

@Component({
  selector: 'app-teacher-link',
  templateUrl: './teacher-link.component.html',
  styleUrls: ['./teacher-link.component.scss']
})
export class TeacherLinkComponent implements OnInit {

  constructor(private studentInfoSerive: StudentInfoService, private commonService: CommonService, private router: Router,
    private route:ActivatedRoute) { }

  form: FormGroup;
  standardData;
  divisionData;
  studentData;
  subjectData;
  teacherData;
  idSchool:number=1;

  ngOnInit(): void {

    this.form = new FormGroup({
      idTeacher: new FormControl(null, [Validators.required]),
      idStandard: new FormControl(null, [Validators.required]),
      idDivision: new FormControl(null, [Validators.required]),
      idSubject: new FormControl(null, [Validators.required]),

    });
    
    this.getStandardData();
    this.getTeacherData();
  }

  getStandardData(){
    this.studentInfoSerive.getStandred({idSchool:this.idSchool}).subscribe((res:any) => {
      this.standardData = res.data;
    });
  }

  getTeacherData(){
    this.studentInfoSerive.getAllTeacher().subscribe((res:any) => {
      this.teacherData = res.data;
    });
  }



  onChangeStandard(idStandard) {
    this.getDivisionData(idStandard);
    this.getAllSubjectData(idStandard);

  }

  getAllSubjectData(idStandard) {
    this.studentInfoSerive.getAllSubject(idStandard.value,this.idSchool).subscribe((res:any) => {
      this.subjectData = res.data;
    });
  }

  getDivisionData(idStandard){
    this.studentInfoSerive.getDivision(idStandard,this.idSchool).subscribe((res:any) => {
      this.divisionData = res.data;
    });
  }

  makeBody() {
    const body = [{
      idStandard:this.form.get('idStandard').value,
      idDivision:this.form.get('idDivision').value,
      idSubject:this.form.get('idSubject').value,
      idTeacher:this.form.get('idTeacher').value,

    }];
    return body;
  }
  submit() {
    if (this.form.valid) {
      const body = this.makeBody();
      this.studentInfoSerive.teacherDetails(body).subscribe(res => {
        this.commonService.openSnackbar('Teacher Details Submitted Successfully', 'Done');
        this.form.reset();
      });
    }
    else {
      this.commonService.openSnackbar('Please Fill All Field', 'Warning');
    }
  }

  back() {
    this.router.navigate(['../dashboard'],{relativeTo:this.route});
  }

}
