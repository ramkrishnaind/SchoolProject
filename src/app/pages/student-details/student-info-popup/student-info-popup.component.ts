import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../../services/student-info.service';
import {Router,ActivatedRoute} from '@angular/router';
import {CommonService} from './../../../shared/common.service';
import * as moment from 'moment';
import { AuthenticationService } from '../../../service/authentication.service';


@Component({
  selector: 'app-student-info-popup',
  templateUrl: './student-info-popup.component.html',
  styleUrls: ['./student-info-popup.component.scss']
})
export class StudentInfoPopupComponent implements OnInit {

  @ViewChild('inputImage') inputImage: ElementRef;
  form: FormGroup;
  fileName;
  selectedFiles: FileList;
  logoError: boolean;
  nationality = [{name:"Indian",value:'Indian'},{name:"Japnies",value:'Japnies'}];
  country = [];
  state =  [];
  city =  [];
  gender = [{ name: 'Male', value: 'male'}, { name: 'Female', value:'female' }, { name: 'Others', value: 'others' }];
  standardData;
  divisionData;
  parentData;
  name;
  rollno;
  idStudent;
  stdname: any;
  rowData: any;
  dob: any;
  age: any;
  bloodgroup: any;
  pmobileno: any;
  smobileno: any;
  emergancyConntact: any;
  email: any;
  semail: any;
  subjects: any;
  academicyear: any;
  address: any;
  address2: any;
  minDate = new Date(2000, 0, 1);
  maxDate:Date;
  EMAIL = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$";
  BloodGroup =  [{name:"A+",value:'A+'},{name:"B+",value:'B+'}];
  idSchool:number;
  standardId;
  divisionId;
  nationalityId;
  countryId;
  stateId;
  cityId;
  parentId;
  profileurl:string;
  gen;
  studentImageDataUploadToS3;
  loading:boolean=false;
  // byDefaultStandardSelect;
  fileUpload:boolean=false;

  attributeData=
  {
   name:'name',
   profileurl:'businessLogoUrl',
   standardId:'idStandard',
   divisionId:"idDivision",
   rollno:'rollno',
   gen:'gender',
   age:'age',
   dob:'dob',
   email:'email',
   semail:'semail',
   pmobileno:'pmobileno',
   smobileno:'smobileno',
   address:'address',
   address2:'address2',
   academicyear:'academicyear',
   parentId:'idParent',
   bloodgroup:'bloodgrp',
   emergancyConntact:'emergancyConntact',
   nationalityId:'nationality',
   countryId:'country',
   stateId:'state',
   cityId:'city',
   subjects:'subjects',
}
  constructor(private studentInfoSerive:StudentInfoService, private commonService:CommonService,
    private activatedRoute:ActivatedRoute,private router:Router,private fb: FormBuilder,private authservice:AuthenticationService) {
      this.idSchool = this.authservice.idSchool;
      const currentYear = new Date().getFullYear();
      this.maxDate = new Date();

      this.activatedRoute.queryParams.subscribe(params =>{
  this.name = params['name'];
  this.rollno = params['rollno'];
  this.dob = params['dob'];
  this.age = params['age'];
  this.bloodgroup = +params['idBloodGroup'];
  this.pmobileno = params['pmobileno'];
  this.smobileno = params['smobileno'];
  this.emergancyConntact = params['emergancyConntact'];
  this.email = params['email'];
  this.semail = params['semail'];
  this.subjects = params['subjects'];
  this.academicyear = params['academicyear'];
  this.address = params['address'];
  this.address2 = params['address2'];
  this.idStudent = params['idStudent'];
  this.standardId = +params['idStandard'];
  this.divisionId = +params['idDivision'];
  this.parentId = +params['idParent'];
  this.nationalityId = +params['idNationality'];
  this.countryId = +params['idCountry'];
  this.stateId = +params['idState'];
  this.cityId = +params['idCity'];
  this.gen = params['gender'];
  this.profileurl = params['profileurl'];
  

  
      });
   
     }

    ngOnInit() {
      this.form = this.fb.group({
        name:new FormControl(this.name, [Validators.required,Validators.pattern("[A-Za-z ]*")]),
        businessLogo: new FormControl(null),
        businessLogoUrl: new FormControl(this.profileurl, [Validators.required]),
        idStandard:new FormControl(this.standardId, [Validators.required]),
        idDivision:new FormControl(this.divisionId, [Validators.required]),
        rollno:new FormControl(this.rollno, [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10)]),
        gender:new FormControl(this.gen, [Validators.required]),
        age:new FormControl(this.age, [Validators.required,Validators.pattern("^[0-9]*$")]),
        dob:new FormControl(moment(this.dob).format('YYYY-MM-DD'), [Validators.required]),
        email:new FormControl(this.email, [Validators.required,Validators.pattern(this.EMAIL)]),
        pmobileno:new FormControl(this.pmobileno, [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10),Validators.minLength(10)]),
        smobileno:new FormControl(this.smobileno, [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10),Validators.minLength(10)]),
        address:new FormControl(this.address, [Validators.required]),
        subjects:new FormControl(this.subjects, [Validators.required]),
        academicyear:new FormControl(this.academicyear, [Validators.required]),
        idParent:new FormControl(this.parentId, [Validators.required]),
        bloodgrp:new FormControl(this.bloodgroup, [Validators.required]),
        semail:new FormControl(this.semail, [Validators.required,Validators.pattern(this.EMAIL)]),
        address2:new FormControl(this.address2, [Validators.required]),
        emergancyConntact:new FormControl(this.emergancyConntact, [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10),Validators.minLength(10)]),
        nationality:new FormControl(this.nationalityId, [Validators.required]),
        country:new FormControl(this.countryId, [Validators.required]),
        state:new FormControl(this.stateId, [Validators.required]),
        city:new FormControl(this.cityId, [Validators.required]),
      });
      
      this.getStandardData();
      this.getDivisionData({value:this.standardId})
      this.getParentData();
      this.getBloodGroupData();
      this.getNationalityData();
      this.getCountryData();
      this.getStateData(this.stateId);
      this.getCityData(this.cityId);
    
     
      // this.form.controls['name'].patchValue(this.name);
      // this.form.controls['rollno'].patchValue(this.rollno);
      // this.form.controls['dob'].patchValue(this.dob);
      // this.form.controls['dob'].patchValue(this.idParent);
      // this.form.controls['age'].patchValue(this.age);
      // this.form.controls['bloodgrp'].patchValue(this.bloodgrp);
      // this.form.controls['pmobileno'].patchValue(this.pmobileno);
      // this.form.controls['smobileno'].patchValue(this.smobileno);
      // this.form.controls['emergancyConntact'].patchValue(this.emergancyConntact);
      // this.form.controls['email'].patchValue(this.email);
      // this.form.controls['semail'].patchValue(this.semail);
      // this.form.controls['subjects'].patchValue(this.subjects);
      // this.form.controls['academicyear'].patchValue(this.academicyear);
      // this.form.controls['address'].patchValue(this.address);
      // this.form.controls['address2'].patchValue(this.address2);
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
      })
    }
    getCountryData(){
      this.studentInfoSerive.getCountry().subscribe((res:any) =>{
        this.country = res;
      })
    }
    onChangeCountry(country){
      this.getStateData(this.form.get('country').value);
    }
    getStateData(countryValue){
      this.studentInfoSerive.getState().subscribe((res:any) =>{
        res.forEach(dt => {
          if(dt.idCountry === countryValue){
            this.state.push(dt);
          }
        });
      })
    }
    onChangeState(state){
      this.getCityData(this.form.get('state').value);
    }
    getCityData(stateValue){
      this.studentInfoSerive.getCity().subscribe((res:any) =>{
        res.forEach(dt => {
          if(dt.idState === stateValue){
            this.city.push(dt);
          }
        });
      })
    }

    onChangeStandard(idStandard){
      this.getDivisionData(idStandard);
  
    }

    getDivisionData(idStandard){
      this.studentInfoSerive.getDivision(idStandard,this.idSchool).subscribe( (res:any) =>{
        this.divisionData = res.data;
       
      })
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
    // }
    // upload() {
    //   const file = this.selectedFiles.item(0);
    //   this.studentInfoSerive.uploadFile(file);
    //   this.fileName = file.name;
    // }
    //    selectFile(event) {
    //   this.selectedFiles = event.target.files;
    //   }
    
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
          idStudent:this.idStudent,
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
          subjects:this.form.get('subjects').value,
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
          profileurl:this.profileurl,
          idSchoolDetails:this.idSchool
  
        };
        return body;
      }

      dobClick(e){
        // this.form.get('dob').setValue(moment(e).format('YYYY-MM-DD'));
        let now = moment();
        const age = now.diff(moment(e),'year');
        this.form.get('age').setValue(age);
      }

      buttonSecond(){
        this.submit();
      }
      
      submit(){
        if(this.form.valid && this.checkChangeInValueForUpdate()){
        const body = this.makeBody();
        this.loading = true;
        this.studentInfoSerive.studentInformation(body).subscribe(res =>{
          if(res){
            this.commonService.openSnackbar('Student Information Updated Successfully','Done');
            this.back();
          }
          else{
            this.commonService.openSnackbar('Some error occured in update process','Done');
          }
          this.loading = false
        });
      }
      else{
       this.commonService.openSnackbar('Please,Make changes to Update','Warning');
      }
       
      }

      checkChangeInValueForUpdate(){
        let flag = false;
        const keys = Object.keys(this.attributeData)
        
      
        for (const key in this.attributeData) {
          if(key === 'dob'){
            if(!moment(moment(this[key]).format('YYYY-MM-DD')).isSame(moment(this.form.get(this.attributeData[key]).value).format('YYYY-MM-DD'))){
              // console.log(`${key}: ${courses[key]}`);
              flag = true;
              break;
            }
          }
          else{
          if(this[key] != this.form.get(this.attributeData[key]).value){
            // console.log(`${key}: ${courses[key]}`);
            flag = true;
            break;
    
          }
        }
        };
    
        return flag;
       }

      
      
      back(){
        this.router.navigate(['../../student-details'],{relativeTo:this.activatedRoute});
      }
     
  

}
