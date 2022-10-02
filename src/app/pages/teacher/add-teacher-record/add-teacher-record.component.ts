import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../service/authentication.service';
import { CommonService } from 'src/app/shared/common.service';
import * as XLSX from 'xlsx';
import { StudentInfoService } from '../../services/student-info.service';

function ValidatePhone(mobilenumber){
  return function(control: AbstractControl): {[key: string]: any} | null  {
    if (control.value && control.value === mobilenumber) {
      return { 'phoneNumberInvalid': true };
    }
    return null;
  }
  }

@Component({
  selector: 'app-add-teacher-record',
  templateUrl: './add-teacher-record.component.html',
  styleUrls: ['./add-teacher-record.component.scss']
})
export class AddTeacherRecordComponent implements OnInit {

  
  @ViewChild('inputFile') inputFile: ElementRef;
  @ViewChild('inputImage') inputImage: ElementRef;
  
  header = 'Teacher Details';
  form: FormGroup;
  fileName;
  selectedFiles: File;
  logoError: boolean;
  standardData;
  divisionData;
  studentData;
  subjectData;
  dataSource;
  EMAIL = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$";
  teacherImageDataUploadToS3;
  idSchool:number;
  idToNavigate;
  teacherEditData;
  fileUpload=false;
  loading:boolean=false;
  attributeData=
    {
     name:'teacher',
     email:'email',
     education:'education',
     contact:'phoneNumber',
     whatsappno:'whatsappNumber',
     profileurl:'businessLogoUrl'
}
fileAdded:string='fileblank';
  selectedFile:File;
  excelFileUpload:boolean=false;
  constructor(private studentInfoSerive: StudentInfoService, private commonService: CommonService, private router: Router,
    private route:ActivatedRoute,private iconRegistry: MatIconRegistry,private sanitizer: DomSanitizer,private authservice:AuthenticationService) {
      iconRegistry.addSvgIcon('excel', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/svgIcon/excel.svg'));
      this.idSchool = this.authservice.idSchool;
      this.idToNavigate = +this.route.snapshot.queryParams['id'] || 0;
      if(this.idToNavigate != 0){
        this.getSpecificTeacherData();
        // this.header = 'Edit Teacher Details';
      }
     }

  ngOnInit(): void {


    this.form = new FormGroup({
      businessLogo: new FormControl(null),
      businessLogoUrl: new FormControl(null, [Validators.required]),
      // idteacher: new FormControl(null, [Validators.required]),
      teacher: new FormControl(null, [Validators.required]),
      // idStandard: new FormControl(null, [Validators.required]),
      // idDivision: new FormControl(null, [Validators.required]),
      // idSubject: new FormControl(null, [Validators.required]),
      email:new FormControl(null, [Validators.required,Validators.pattern(this.EMAIL)]),
      education:new FormControl(null, [Validators.required]),
      whatsappNumber:new FormControl(null, [Validators.required,Validators.pattern("^[0-9]{10}$"),Validators.maxLength(10),Validators.minLength(10)]),
      phoneNumber:new FormControl(null, [Validators.required,Validators.pattern("^[0-9]{10}$"),Validators.maxLength(10),,Validators.minLength(10)]),

    });
    
    // this.getStandardData();
    // this.getTeacherData();
    
  }

  getSpecificTeacherData(){
    this.studentInfoSerive.getAllTeacher().subscribe((res:any) =>{
      res.data.forEach(data => {
        if(data.idTeacher === this.idToNavigate){
          this.teacherEditData = data;
          this.updateValue();
        }
      });
     });
  }

  updateMobileNumber(data){
    if(data.length === 10){
    this.form.get('phoneNumber').setValidators([Validators.required,Validators.pattern("^[0-9]{10}$"),ValidatePhone(data)]);
    this.form.get('phoneNumber').updateValueAndValidity();
    }
  }

  updateValue(){
    this.form.get('teacher').setValue(this.teacherEditData.name);
    this.form.get('email').setValue(this.teacherEditData.email);
    this.form.get('education').setValue(this.teacherEditData.education);
    this.form.get('whatsappNumber').setValue(this.teacherEditData.whatsappno);
    this.form.get('phoneNumber').setValue(this.teacherEditData.contact);
    this.form.get('businessLogoUrl').setValue(this.teacherEditData.profileurl); 
    this.teacherImageDataUploadToS3 = this.teacherEditData.profileurl;
    // this.form.get('parentName').setValue(this.parentData.name);
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

  checkValidFile(file){
    const fileTypes = [
      "image/apng",
      "image/bmp",
      "image/gif",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    
      return fileTypes.includes(file[0].type) && file.length === 1;
  }

  handleFileInput(event){
    if (this.checkValidFile(event.target.files)) {
      this.form.get('businessLogo').setValue(event.target.files[0]); 
      this.logoError = false;           
      const reader = new FileReader();
      reader.onload = () => {
        this.form.get('businessLogoUrl').setValue(reader.result as string); 
        // this.selectedFiles = event.target.files; 
        this.uploadTeacherImage(event.target.files[0]); 
      }
      reader.readAsDataURL(this.form.get('businessLogo').value);
      event.value = null;
    }
    else{
      this.inputImage.nativeElement.value = '';
    }
  }

  uploadTeacherImage(file){
    // const file = this.selectedFiles[0];
    this.fileUpload = true;
    this.studentInfoSerive.uploadFile(file);
    this.fileName = file.name;
    setTimeout(() => {
      this.studentInfoSerive.getFile().subscribe((uploadingData) => {
        // this.CommonService.hideSppiner();
        this.teacherImageDataUploadToS3 =uploadingData.data.Location;
        this.fileUpload = false;
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
    let body = [{
      name: this.form.get('teacher').value,
      email: this.form.get('email').value,
      education: this.form.get('education').value,
      contact:this.form.get('phoneNumber').value,
      whatsappno: this.form.get('whatsappNumber').value,
      profileurl:this.teacherImageDataUploadToS3,
      idSchoolDetails:this.idSchool

    }];

    if(this.idToNavigate != 0){
      body[0]['idTeacher'] = this.idToNavigate;
     }

    return body;
  }

  buttonSecond(){
    this.submit();
  }
  submit() {
    const data = this.checkDataForUpdate();
    if (data.valid) {
      const body = this.makeBody();
      this.loading = true;
      this.studentInfoSerive.saveTeacherData(body).subscribe((res:any) => {
        if(!res.error){
          this.loading = false;
          if(this.idToNavigate){
            this.commonService.openSnackbar('Teacher Data Updated Successfully','Done');
            this.back();
          }
          else{
            this.commonService.openSnackbar('Teacher Data Added Successfully','Done');
            this.form.reset();
          }
        }
        else{
          this.loading = false;
          this.commonService.openSnackbar('Teacher Details are incorrect or format', 'Warning');
        }
      });
    }
    else {
      this.commonService.openSnackbar(data.msg, 'Warning');
    }
  }

   checkDataForUpdate(){
    if(this.idToNavigate === 0){
      return {msg:'Please Fill All Field and Upload File also', valid:this.form.valid }
    }
    else{
      return {msg:'Please,Make changes to Update' ,valid:this.form.valid && this.checkChangeInValueForUpdate()}
    }
   }

   checkChangeInValueForUpdate(){
    let flag = false;
    const keys = Object.keys(this.attributeData)
    
  
    for (const key in this.attributeData) {
      if(this.teacherEditData[key] != this.form.get(this.attributeData[key]).value){
        flag = true;
        break;

      }
    };

    return flag;
   }
 
   clickToAddFile(){
    document.getElementById('fileExcel').click();
   }


   onFileChange(event) {
    const isExcelFile = !!event.target.files[0].name.match(/(.xls|.xlsx)/);
    if (event.target.files.length > 1 || !isExcelFile) {
      this.inputFile.nativeElement.value = '';
      this.fileAdded = 'fileblank';
    }
    else{
      this.selectedFile = event.target.files[0];
      this.upload();
    }
  
  }

  upload(){
      this.excelFileUpload = true;
      let workBook = null;
      let jsonData = null;
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary' });
        workBook.SheetNames.forEach(element => {
  
          jsonData = XLSX.utils.sheet_to_json(workBook.Sheets[element]);
          setTimeout(() =>{
            this.studentInfoSerive.saveTeacherData(jsonData).subscribe(res =>{
              if(res){
              this.fileAdded = 'fileupload';
              this.excelFileUpload = false;
              this.commonService.openSnackbar('Teacher Data Uploaded Successfully','Done');
              }
            });
          },5000);
           }); 
   }
      reader.readAsBinaryString(this.selectedFile);
  }

  downloadFormat(){

  }

  back(){
    this.router.navigate(['../../teacher'],{relativeTo:this.route});
   }

}
