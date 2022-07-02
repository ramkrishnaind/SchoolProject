import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../services/student-info.service';
import { CommonService } from 'src/app/shared/common.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-homework',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.scss']
})
export class HomeworkComponent implements OnInit {
  logoError: boolean;
  form: FormGroup;
  fileName;
  selectedFiles: FileList;
  standardData;
  divisionData;
  subjectData;
  teacherData;
  minDate:Date;
  maxDate:Date;
  idSchool:number=1
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,private router:Router,
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

  ngOnInit(): void {
    this.form = new FormGroup({
      homeworkName:new FormControl(null,[Validators.required]),
      idTeacher:new FormControl(null,[Validators.required]),
      businessLogo: new FormControl(null, [Validators.required]),
      businessLogoUrl: new FormControl(null, [Validators.required]),
      Description: new FormControl(null, [Validators.required]),
      assigndate: new FormControl(null, [Validators.required]),
      duedate: new FormControl(null, [Validators.required]),
      idStandard: new FormControl(null, [Validators.required]),
      idDivision: new FormControl(null, [Validators.required]),
      idSubject: new FormControl(null, [Validators.required])
      
     
    });
    this.studentInfoSerive.getStandred({idSchool:this.idSchool}).subscribe((res:any) =>{
      this.standardData = res.data;
    });
    this.studentInfoSerive.getAllTeacher().subscribe((res:any) =>{
     this.teacherData = res.data;
    })
    
  }

  onChangeStandred(idStandard){
    this.getAllDivisionBasedOnStandard(idStandard);
    this.getAllSubject(idStandard);
   }

   getAllDivisionBasedOnStandard(idStandard){
    this.studentInfoSerive.getDivision(idStandard,this.idSchool).subscribe((res:any) =>{
      this.divisionData = res.data;
    });
   }


   getAllSubject(idStandard){
     this.studentInfoSerive.getAllSubject(idStandard.value,this.idSchool).subscribe((res:any) =>{
      this.subjectData = res.data;
     })
   }
  addLogo(): void {
    document.getElementById('file').click();
  }
  handleFileInput(event) {
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
  upload() {
    const file = this.selectedFiles.item(0);
    this.studentInfoSerive.uploadFile(file);
    if(file){
      this.commonService.openSnackbar('image uploaded successfully','Done');
      }
      else{
        this.commonService.openSnackbar('please select image','Warning');
      }
    this.fileName = file.name;
    console.log("::::::::::",this.fileName);
  }
     selectFile(event) {
    this.selectedFiles = event.target.files;
    }
    makeBody(){
      const body ={
      homeworkName:this.form.get('homeworkName').value,
      idTeacher:this.form.get('idTeacher').value,
      idStandard:this.form.get('idStandard').value,
      idDivision:this.form.get('idDivision').value,
      idSubject:this.form.get('idSubject').value,
      description:this.form.get('Description').value,
      assigndate:this.form.get('assigndate').value,
      duedate:this.form.get('duedate').value,
      attachment:'https://mytestschool.s3.ap-south-1.amazonaws.com/s3%3A//mytestschool/pdf/'+`${this.fileName}`
       
      };
      return body;
    }
    homeworkInformation(){
      if(this.form.valid){
      const body = this.makeBody();
      this.studentInfoSerive.homeworkDetails(body).subscribe(res =>{
        this.commonService.openSnackbar('Student Homework Submitted Successfully','Done');
      this.form.reset();
      });
    }
    else{
      this.commonService.openSnackbar('Please Fill All Field','Warning');
    }
    }
    back(){
      this.router.navigate(['../../dashboard'],{relativeTo:this.route});
    }

    onFileChange(event){

    }

}
