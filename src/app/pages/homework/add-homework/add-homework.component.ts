import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../../services/student-info.service';
import { CommonService } from 'src/app/shared/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-homework',
  templateUrl: './add-homework.component.html',
  styleUrls: ['./add-homework.component.scss']
})
export class AddHomeworkComponent implements OnInit {

  
  @ViewChild('inputFile') inputFile: ElementRef;
  logoError: boolean;
  form: FormGroup;
  fileName;
  fileClick:boolean = false;
  standardData;
  divisionData;
  subjectData;
  teacherData;
  minDate:Date;
  maxDate:Date;
  idSchool:number=1
  process='';
  fileUploadUrl;
  editedHomeworkData:any;
  attributeData=
    {
      homeworkName:'homeworkName',
      idTeacher:'idTeacher',
      idStandard:'idStandard',
      idDivision:'idDivision',
      idSubject:'idSubject',
      description:'Description',
      assigndate:'assigndate',
      duedate:'duedate',
      attachment:'attachment'
}
fileAdded:string='fileblank';
  selectedFile:File;
  fileUpload:boolean=false;
  loading:boolean=false;
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,private router:Router,
    private route :ActivatedRoute,private iconRegistry: MatIconRegistry,private sanitizer: DomSanitizer) { 
      // this.idToNavigate = +this.route.snapshot.queryParams['id'] || 0;
      // if(this.idToNavigate != 0){
      //   this.getSpecificTeacherData();
      // }
      iconRegistry.addSvgIcon('excel', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/svgIcon/file.svg'));
      if(this.router.getCurrentNavigation().extras.state != undefined){
        this.editedHomeworkData =this.router.getCurrentNavigation().extras.state;
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

  ngOnInit(): void {
    this.form = new FormGroup({
      homeworkName:new FormControl(null,[Validators.required]),
      idTeacher:new FormControl(null,[Validators.required]),
      idStandard: new FormControl(null, [Validators.required]),
      idDivision: new FormControl(null, [Validators.required]),
      idSubject: new FormControl(null, [Validators.required]),
      // businessLogo: new FormControl(null, [Validators.required]),
      attachment: new FormControl(null, [Validators.required]),
      Description: new FormControl(null, [Validators.required]),
      assigndate: new FormControl(null, [Validators.required]),
      duedate: new FormControl(null, [Validators.required]),
      
      
     
    });
    this.studentInfoSerive.getStandard({idSchool:this.idSchool}).subscribe((res:any) =>{
      this.standardData = res.data;
      if(this.editedHomeworkData){
        this.getAllDivisionBasedOnStandard({value:this.editedHomeworkData.idStandard},'update');
      }
    });
    this.studentInfoSerive.getAllTeacher().subscribe((res:any) =>{
     this.teacherData = res.data;
    })
    
  }


  onChangeStandard(idStandard){
    this.getAllDivisionBasedOnStandard(idStandard,'normal');
   }

   getAllDivisionBasedOnStandard(idStandard,callFor){
    this.studentInfoSerive.getDivision(idStandard,this.idSchool).subscribe((res:any) =>{
      this.divisionData = res.data;
      this.getAllSubject(idStandard,callFor);
    });
   }


   getAllSubject(idStandard,callFor){
     this.studentInfoSerive.getAllSubject(idStandard.value,this.idSchool).subscribe((res:any) =>{
      this.subjectData = res.data;
      if(callFor === 'update'){
        this.updateValue();
      }
     })
   }

   updateValue(){
    this.form.get('homeworkName').setValue(this.editedHomeworkData.homeworkName);
    this.form.get('idTeacher').setValue(this.editedHomeworkData.idTeacher);
    this.form.get('idStandard').setValue(this.editedHomeworkData.idStandard);
    this.form.get('idDivision').setValue(this.editedHomeworkData.idDivision);
    this.form.get('idSubject').setValue(this.editedHomeworkData.idSubject);
    this.form.get('Description').setValue(this.editedHomeworkData.description); 
    this.form.get('assigndate').setValue(moment(this.editedHomeworkData.assigndate).format('YYYY-MM-DD')); 
    this.form.get('duedate').setValue(moment(this.editedHomeworkData.duedate).format('YYYY-MM-DD')); 
    this.form.get('attachment').setValue(this.editedHomeworkData.attachment); 
    // this.teacherImageDataUploadToS3 = this.editedHomeworkData.profileurl;
    // this.form.get('parentName').setValue(this.parentData.name);
  }
  // addLogo(): void {
  //   document.getElementById('file').click();
  // }
  // handleFileInput(event) {
  //   if (event.target.files[0]) {
  //     this.form.get('businessLogo').setValue(event.target.files[0]); 
  //     this.logoError = false;           
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.form.get('businessLogoUrl').setValue(reader.result as string);        
  //     }
  //     reader.readAsDataURL(this.form.get('businessLogo').value);
  //     event.value = null;
  //   }
  //}
  // upload() {
  //   const file = this.selectedFile.item(0);
  //   this.studentInfoSerive.uploadFile(file);
  //   if(file){
  //     this.commonService.openSnackbar('image uploaded successfully','Done');
  //     }
  //     else{
  //       this.commonService.openSnackbar('please select image','Warning');
  //     }
  //   this.fileName = file.name;
  // }
    //  selectFile(event) {
    // this.selectedFile = event.target.files;
    // }
    makeBody(){
      const body ={
      homeworkName:this.form.get('homeworkName').value,
      idTeacher:this.form.get('idTeacher').value,
      idStandard:this.form.get('idStandard').value,
      idDivision:this.form.get('idDivision').value,
      idSubject:this.form.get('idSubject').value,
      description:this.form.get('Description').value,
      assigndate:moment(this.form.get('assigndate').value).format('YYYY-MM-DD'),
      duedate:moment(this.form.get('duedate').value).format('YYYY-MM-DD'),
      attachment:this.fileUploadUrl
       
      };

      if(this.editedHomeworkData){
        body['idHomework'] = this.editedHomeworkData.idHomework;
       }

      return body;
    }

    buttonSecond(){
      this.homeworkInformation();
     }
  
    homeworkInformation(){
      const data = this.checkDataForUpdate();
      if(data.valid){
      const body = this.makeBody();
      this.loading = true;
      this.studentInfoSerive.homeworkDetails(body).subscribe(res =>{
        if(res){
          this.loading = false;
          if(this.editedHomeworkData){
            this.commonService.openSnackbar('Student Homework Submitted Successfully','Done');
            this.back();
          }
          else{
            this.commonService.openSnackbar('Student Homework Added Successfully','Done');
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
      if(this.editedHomeworkData){
        return {msg:'Please,Make changes to Update' ,valid:this.form.valid && this.checkChangeInValueForUpdate()}
      }
      else{
        return {msg:'Please Fill All Field and Upload File also', valid:this.form.valid }
      }
     }
  
     checkChangeInValueForUpdate(){
      let flag = false;
      const keys = Object.keys(this.attributeData)
      
    
      for (const key in this.attributeData) {
        if(key === 'assigndate'|| key === 'duedate'){
          if(!moment(moment(this.editedHomeworkData[key]).format('YYYY-MM-DD')).isSame(moment(this.form.get(this.attributeData[key]).value).format('YYYY-MM-DD'))){
            flag = true;
            break;
          }
        }
        else{
        if(this.editedHomeworkData[key] != this.form.get(this.attributeData[key]).value){
          flag = true;
          break;
  
        }
      }
      };
  
      return flag;
     }

    back(){
      this.router.navigate(['../../homework'],{relativeTo:this.route});
    }

    clickToAddFile(){
      document.getElementById('file').click();
     }
  
  
     onFileChange(event) {
      if (event.target.files.length > 1) {
        this.inputFile.nativeElement.value = '';
        this.fileAdded = 'fileblank';
      }
      else{
        this.selectedFile = event.target.files[0];
        this.upload();
      }
    
    }
  
    upload(){
        this.fileUpload = true;
        this.studentInfoSerive.uploadHomeWorkFile(this.selectedFile).subscribe((res:any)=>{
          this.fileUpload =false;
          this.fileUploadUrl = res.data.body;
          this.form.get('attachment').setValue(this.fileUploadUrl); 
          this.fileAdded ='fileupload';
          this.commonService.openSnackbar('File uploaded successfully!','Done');
        },error=>{
          this.fileUpload =false;
          this.fileAdded ='fileerror';
          this.commonService.openSnackbar('File Do not uploaded','Error');
        });
    }

    downloadFormat(){
      let link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.setAttribute('download', 'download.jpg');
      link.setAttribute('type', 'hidden');
      link.href = this.editedHomeworkData.attachment;
      // link.download = path;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }


}
