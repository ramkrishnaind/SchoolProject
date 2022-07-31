import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../../services/student-info.service';
import {CommonService} from './../../../shared/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.scss']
})
export class StudentInfoComponent implements OnInit {
  
  @ViewChild('inputImage') inputImage: ElementRef;
  form: FormGroup;
  fileName;
  selectedFiles: FileList;
  logoError: boolean;
  nationality = [{name:"Indian",value:'Indian'},{name:"Japnies",value:'Japnies'}];
  country = [];
  state =  [];
  city =  [];
  BloodGroup =  [{name:"A+",value:'A+'},{name:"B+",value:'B+'}];
  gender = [{ name: 'Male', value: 'male'}, { name: 'Female', value:'female' }, { name: 'Others', value: 'others' }];
  standardData;
  divisionData;
  parentData;
  subjectData;
  minDate = new Date(2000, 0, 1);
  maxDate:Date;
  EMAIL = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$";
  studentImageDataUploadToS3;
  idSchool:number=1;
  fileUpload:boolean=false;
  idToNavigate;
  studentEditData;
  loading:boolean=false;
  constructor(private studentInfoSerive:StudentInfoService, private commonService:CommonService,
    private router:Router,private route:ActivatedRoute) {
      const currentYear = new Date().getFullYear();
      this.maxDate = new Date()
     }

  ngOnInit() {
    this.form = new FormGroup({
      name:new FormControl(null, [Validators.required,Validators.pattern("[A-Za-z ]*")]),
      businessLogo: new FormControl(null),
      businessLogoUrl: new FormControl(null, [Validators.required]),
      idStandard:new FormControl(null, [Validators.required]),
      idDivision:new FormControl(null, [Validators.required]),
      rollno:new FormControl(null, [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10)],),
      gender:new FormControl(null, [Validators.required,]),
      age:new FormControl(null, [Validators.required,Validators.pattern("^[0-9]*$")]),
      dob:new FormControl(null, [Validators.required]),
      email:new FormControl(null, [Validators.required,Validators.pattern(this.EMAIL)]),
      pmobileno:new FormControl(null, [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10),Validators.minLength(10)]),
      smobileno:new FormControl(null, [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10),Validators.minLength(10)]),
      address:new FormControl(null, [Validators.required]),
      subjects:new FormControl(null, [Validators.required]),
      academicyear:new FormControl(null, [Validators.required]),
      idParent:new FormControl(null, [Validators.required]),
      bloodgrp:new FormControl(null, [Validators.required]),
      semail:new FormControl(null, [Validators.required,Validators.pattern(this.EMAIL)]),
      address2:new FormControl(null, [Validators.required]),
      emergancyConntact:new FormControl(null, [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10),Validators.minLength(10)]),
      nationality:new FormControl(null, [Validators.required]),
      country:new FormControl(null, [Validators.required]),
      state:new FormControl(null, [Validators.required]),
      city:new FormControl(null, [Validators.required]),
    });
   
   this.getStandardData();
   this.getParentData();
   this.getBloodGroupData();
   this.getNationalityData();
   this.getCountryData();
  }


  getStandardData(){
    this.studentInfoSerive.getStandard({idSchool:this.idSchool}).subscribe((res:any) =>{
      this.standardData = res.data;
    });
  }

  getParentData(){
    this.studentInfoSerive.parentDetails().subscribe(res =>{
      this.parentData = res;
     });
  }

  getBloodGroupData(){
    this.studentInfoSerive.getListOfBloodGroupData().subscribe((res:any) =>{
      this.BloodGroup = res;
    })
  }
  getNationalityData(){
    this.studentInfoSerive.getNationality().subscribe((res:any) =>{
      this.nationality = res;
      this.nationality.forEach((data:any)=>{
        if(data.name === 'INDIAN'){
         this.form.get('nationality').setValue(data.idNationality);
        }
   });
    })
  }
  getCountryData(){
    this.studentInfoSerive.getCountry().subscribe((res:any) =>{
      this.country = res;
      this.country.forEach((data:any)=>{
        if(data.name === 'INDIA'){
         this.form.get('country').setValue(data.idCountry);
        }
   });
    })
  }
  onChangeCountry(country){
    this.getStateData();
  }
  getStateData(){
    this.studentInfoSerive.getState().subscribe((res:any) =>{
      res.forEach(dt => {
        if(dt.idCountry === this.form.get('country').value){
          this.state.push(dt);
        }
      });
    })
  }
  onChangeState(state){
    this.getCityData();
  }
  getCityData(){
    this.studentInfoSerive.getCity().subscribe((res:any) =>{
      res.forEach(dt => {
        if(dt.idState === this.form.get('state').value){
          this.city.push(dt);
        }
      });
    })
  }
  onChangeStandard(idStandard){
    this.getDivisionData(idStandard);
    this.getAllSubject();
  }

  getDivisionData(idStandard){
    this.studentInfoSerive.getDivision(idStandard,this.idSchool).subscribe( (res:any) =>{
      this.divisionData = res.data;
    })
  }

  getAllSubject(){
    const idStandard = this.form.get('idStandard').value
    this.studentInfoSerive.getAllSubject(idStandard,this.idSchool).subscribe( (res:any) =>{
      this.subjectData = res.data
      this.subjectData.unshift({
        "idSubject": 0,
        "name": "ALL",
        "idStandard": idStandard,
        "idSchoolDetails": this.idSchool
    },)
    this.subjectData.forEach(subject => {
      subject['disable']=false
   });
    });
  }

  onChangeSubject(idSubject){
    const allSelected = idSubject.value.indexOf(0);
    if(allSelected != -1){
      this.subjectData.forEach(val =>{
       if(val.idSubject !=0 ){
        val.disable = true;
       }
      });
      this.form.get('subjects').setValue(0);
    }
    else{
      this.subjectData.forEach(subject => {
        subject.disable=false
     });
    }
  }
 
  addLogo(): void {
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

  handleFileInput(event) {
   if (this.checkValidFile(event.target.files)) {
      this.form.get('businessLogo').setValue(event.target.files[0]); 
      this.logoError = false;           
      const reader = new FileReader();
      reader.onload = () => {
        this.form.get('businessLogoUrl').setValue(reader.result as string); 
        this.upload(event.target.files[0]);        
      }
      reader.readAsDataURL(this.form.get('businessLogo').value);
      event.value = null;
    }
    else{
      this.inputImage.nativeElement.value = '';
    }
  }
  upload(file) {
    // const file = this.selectedFiles.item(0);
    this.fileUpload = true;
    this.studentInfoSerive.uploadFile(file);
    this.fileName = file.name;
    setTimeout(() => {

      this.studentInfoSerive.getFile().subscribe((uploadingData) => {
        // this.CommonService.hideSppiner();
        this.studentImageDataUploadToS3 =uploadingData.data;
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

    makeBody(){
      const body ={
        name:this.form.get('name').value,
        idStandard:this.form.get('idStandard').value,
        idDivision:this.form.get('idDivision').value,
        rollno:this.form.get('rollno').value,
        gender:this.form.get('gender').value,
        age:this.form.get('age').value,
        dob:moment(this.form.get('dob').value).format('YYYY-MM-DD'),
        email:this.form.get('email').value,
        pmobileno:this.form.get('pmobileno').value,
        smobileno:this.form.get('smobileno').value,
        address:this.form.get('address').value,
        subjects:this.getSelectedSubject(),
        academicyear:this.form.get('academicyear').value,
        idParent:this.form.get('idParent').value,
        idBloodGroup:this.form.get('bloodgrp').value,
        semail:this.form.get('semail').value,
        address2:this.form.get('address2').value,
        emergancyConntact:this.form.get('emergancyConntact').value,
        idNationality:this.form.get('nationality').value,
        idCountry:this.form.get('country').value,
        idState:this.form.get('state').value,
        idCity:this.form.get('city').value,
        profileurl:this.studentImageDataUploadToS3.Location,
        idSchoolDetails:this.idSchool

      };
      return body;
    }
    getSelectedSubject(){
      let arrOfSubjectId=[];
        this.subjectData.forEach(subject => {
          if(this.form.get('subjects').value === 0){
            if(subject.idSubject !=0){
              arrOfSubjectId.push(subject.name);
            }
          }
          else{
            const subjectIndex = this.form.get('subjects').value.indexOf(subject.idSubject);
            if(subjectIndex != -1){
              arrOfSubjectId.push(subject.name);
            } 
          }
        });
        return arrOfSubjectId.toString();
      
    }
    buttonSecond(){
      this.submit();
    }

    submit(){
      if(this.form.valid){
      const body = this.makeBody();
      this.loading = true;
      this.studentInfoSerive.studentInformation(body).subscribe((res:any) =>{
        if(res){
          this.commonService.openSnackbar('Student Information Submitted Succesfully','Done');
          this.form.reset();
        }
        else{
          this.commonService.openSnackbar('Some error has occured in data saving','Done');
        }
        this.loading = false;
      });
    }
    else{
     this.commonService.openSnackbar('Please Fill All Filed','Warning');
    }
    }

    

    back(){
      this.router.navigate(['../../student-details'],{relativeTo:this.route});
    }

    dobClick(e){
      // this.form.get('dob').setValue(moment(e).format('YYYY-MM-DD'));
      let now = moment();
      const age = now.diff(moment(e),'year');
      this.form.get('age').setValue(age);
    }
  
}
