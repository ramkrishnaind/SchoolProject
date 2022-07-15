import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';
import { StudentInfoService } from '../services/student-info.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {

  @ViewChild('inputFile') inputFile: ElementRef;
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
  teacherImageDataUploadToS3;
  idSchool:number=1;
  constructor(private studentInfoSerive: StudentInfoService, private commonService: CommonService, private router: Router,
    private route:ActivatedRoute) { }

  ngOnInit(): void {


    this.form = new FormGroup({
      businessLogo: new FormControl(null, [Validators.required]),
      businessLogoUrl: new FormControl(null, [Validators.required]),
      // idteacher: new FormControl(null, [Validators.required]),
      teacher: new FormControl(null, [Validators.required]),
      // idStandard: new FormControl(null, [Validators.required]),
      // idDivision: new FormControl(null, [Validators.required]),
      // idSubject: new FormControl(null, [Validators.required]),
      email:new FormControl(null, [Validators.required,Validators.pattern(this.EMAIL)]),
      education:new FormControl(null, [Validators.required]),
      whatsappNumber:new FormControl(null, [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10),Validators.minLength(10)]),
      phoneNumber:new FormControl(null, [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10),,Validators.minLength(10)]),

    });
    
    // this.getStandardData();
    // this.getTeacherData();
    
  }

  // getStandardData(){
  //   this.studentInfoSerive.getStandard({idSchool:this.idSchool}).subscribe((res:any) => {
  //     this.standardData = res.data;
  //   });
  // }

  // getTeacherData(){
  //   this.studentInfoSerive.getAllTeacher().subscribe((res:any) => {
  //     this.teacherData = res.data;
  //   });
  // }



  // onChangeStandard(idStandard) {
  //   this.getDivisionData(idStandard);
  //   this.getAllSubjectData(idStandard);

  // }

  // getAllSubjectData(idStandard) {
  //   this.studentInfoSerive.getAllSubject(idStandard.value,this.idSchool).subscribe((res:any) => {
  //     this.subjectData = res.data;
  //   });
  // }

  // getDivisionData(idStandard){
  //   this.studentInfoSerive.getDivision(idStandard,this.idSchool).subscribe((res:any) => {
  //     this.divisionData = res.data;
  //   });
  // }


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
        this.teacherImageDataUploadToS3 =uploadingData.data;
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
  // back() {
  //   this.router.navigate(['../../dashboard'],{relativeTo:this.route});
  // }

  makeBody() {
    const body = [{
      name: this.form.get('teacher').value,
      email: this.form.get('email').value,
      education: this.form.get('education').value,
      contact:this.form.get('phoneNumber').value,
      whatsappno: this.form.get('whatsappNumber').value,
      profileurl:this.teacherImageDataUploadToS3.Location,
      idSchoolDetails:this.idSchool

    }];
    return body;
  }
  submit() {
    if (this.form.valid) {
      const body = this.makeBody();
      this.studentInfoSerive.saveTeacherData(body).subscribe(res => {
        this.commonService.openSnackbar('Teacher Details Submitted Successfully', 'Done');
      });
    }
    else {
      this.commonService.openSnackbar('Please Fill All Field', 'Warning');
    }
  }

  onFileChange(event){
    console.log(event);
    const isExcelFile = !!event.target.files[0].name.match(/(.xls|.xlsx)/);
    if (event.target.files.length > 1 || !isExcelFile) {
      this.inputFile.nativeElement.value = '';
    }
    if(isExcelFile){
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      workBook.SheetNames.forEach(element => {
        jsonData = XLSX.utils.sheet_to_json(workBook.Sheets[element])
        console.log("upload ExcelDATa:::::::::::",element);
        this.studentInfoSerive.saveTeacherData(jsonData).subscribe(res =>{
          console.log("upload Excel:::::::::::",res);
          this.commonService.openSnackbar('Upload Result Excel File Successfully','Done');
        })
         });      
 }
    reader.readAsBinaryString(file);
}
  }
}