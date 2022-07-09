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
  fileName;
  selectedFiles: FileList;
  logoError: boolean;
  standardData;
  divisionData;
  studentData;
  subjectData;
  dataSource;
  teacherData;
  EMAIL = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$";
  studentImageDataUploadToS3;
  idSchool:number=1;
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


  //   this.studentInfoSerive.getTestType().subscribe(res =>{
  //     this.testTypeData = res;
  //     this.testTypeName = this.testTypeData.data;
  //   });
  // }
  addLogo(){
    document.getElementById('file').click();
  }
  selectFile(event){
    this.selectedFiles = event.target.files;
  }

  handleFileInput(event){
    if (event.target.files[0]) {
      this.form.get('businessLogo').setValue(event.target.files[0]); 
      this.logoError = false;           
      const reader = new FileReader();
      reader.onload = () => {
        this.form.get('businessLogoUrl').setValue(reader.result as string);        
      }
      reader.readAsDataURL(this.form.get('businessLogo').value);
      event.value = null;
    }
  }

  upload(){
    const file = this.selectedFiles.item(0);
    this.studentInfoSerive.uploadFile(file);
    this.fileName = file.name;
    console.log("::::::::::::::::::",this.fileName)
    setTimeout(() => {
      this.studentInfoSerive.getFile().subscribe((uploadingData) => {
        // this.CommonService.hideSppiner();
        console.log(uploadingData);
        this.studentImageDataUploadToS3 =uploadingData.data;
        if (uploadingData.status == "error") {
          this.commonService.openSnackbar(uploadingData.message,uploadingData.status);
        } else {
          this.commonService.openSnackbar(uploadingData.message,'Done');
        }
        // this.chatBubbleForm.controls['avatarImage'].setValue(resData.data, { emitModelToViewChange: false });
        // this.imageUrl = this.chatBubbleForm.controls['avatarImage'].value;
      });

    },0);
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