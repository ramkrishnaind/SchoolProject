import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';
import { StudentInfoService } from '../../services/student-info.service';

@Component({
  selector: 'app-add-teacher-link',
  templateUrl: './add-teacher-link.component.html',
  styleUrls: ['./add-teacher-link.component.scss']
})
export class AddTeacherLinkComponent implements OnInit {

  editTeacherDetails;
  attributeData=
  {
    idStandard:'idStandard',
    idDivision:'idDivision',
    idSubject:'idSubject',
    idTeacher:'idTeacher',
}
loading:boolean=false;
  constructor(private studentInfoSerive: StudentInfoService, private commonService: CommonService, private router: Router,
    private route:ActivatedRoute) {
      if(this.router.getCurrentNavigation().extras.state != undefined){
        this.editTeacherDetails =this.router.getCurrentNavigation().extras.state;
      }
     }

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
    this.studentInfoSerive.getStandard({idSchool:this.idSchool}).subscribe((res:any) => {
      this.standardData = res.data;
      if(this.editTeacherDetails){
        this.getDivisionData({value:this.editTeacherDetails.idStandard});
      }
    });
  }

  getTeacherData(){
    this.studentInfoSerive.getAllTeacher().subscribe((res:any) => {
      this.teacherData = res.data;
    });
  }



  onChangeStandard(idStandard) {
    this.getDivisionData(idStandard);

  }

  getDivisionData(idStandard){
    this.studentInfoSerive.getDivision(idStandard,this.idSchool).subscribe((res:any) => {
      this.divisionData = res.data;
      this.getAllSubjectData(idStandard);
    });
  }

  getAllSubjectData(idStandard) {
    this.studentInfoSerive.getAllSubject(idStandard.value,this.idSchool).subscribe((res:any) => {
      this.subjectData = res.data;
      if(this.editTeacherDetails){
        this.updateValue();
      }
    });
  }

  updateValue(){
     this.form.get('idStandard').setValue(this.editTeacherDetails.idStandard);
     this.form.get('idDivision').setValue(this.editTeacherDetails.idDivision);
     this.form.get('idSubject').setValue(this.editTeacherDetails.idSubject);
     this.form.get('idTeacher').setValue(this.editTeacherDetails.idTeacher);
     // this.teacherImageDataUploadToS3 = this.editTeacherDetails.profileurl;
     // this.form.get('parentName').setValue(this.parentData.name);
   }


  makeBody() {
    const body = [{
      idStandard:this.form.get('idStandard').value,
      idDivision:this.form.get('idDivision').value,
      idSubject:this.form.get('idSubject').value,
      idTeacher:this.form.get('idTeacher').value,

    }];

    if(this.editTeacherDetails){
      body[0]['idteacherDetail'] = this.editTeacherDetails.idteacherDetail;
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
      this.studentInfoSerive.teacherDetails(body).subscribe(res => {
        if(res){
          this.loading = false;
          if(this.editTeacherDetails){
            this.commonService.openSnackbar('Teacher Details Updated Successfully','Done');
            this.back();
          }
          else{
            this.commonService.openSnackbar('Teacher Details Added Successfully','Done');
            this.form.reset();
          }
        }
      });
    }
    else {
      this.commonService.openSnackbar(data.msg, 'Warning');
    }
  }

  checkDataForUpdate(){
    if(this.editTeacherDetails){
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
      if(this.editTeacherDetails[key] != this.form.get(this.attributeData[key]).value){
        flag = true;
        break;

      }
    };

    return flag;
   }

  back() {
    this.router.navigate(['../teacher-list'],{relativeTo:this.route});
  }

}
