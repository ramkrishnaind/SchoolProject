import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../../services/student-info.service';
import {Router,ActivatedRoute} from '@angular/router';
import {CommonService} from './../../../shared/common.service';
import * as moment from 'moment';


@Component({
  selector: 'app-student-info-popup',
  templateUrl: './student-info-popup.component.html',
  styleUrls: ['./student-info-popup.component.scss']
})
export class StudentInfoPopupComponent implements OnInit {
  form: FormGroup;
  fileName;
  selectedFiles: FileList;
  logoError: boolean;
  nationality = [{name:"Indian",value:'Indian'},{name:"Japnies",value:'Japnies'}];
  country = [];
  state =  [];
  city =  [];
  gender = [{ name: 'Male', value: 'Male'}, { name: 'Female', value:'Female' }, { name: 'Others', value: 'Others' }];
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
  bloodgrp: any;
  pmobileno: any;
  smobileno: any;
  emergancyConntact: any;
  email: any;
  semail: any;
  subjects: any;
  academicyear: any;
  address: any;
  address2: any;
  idParent: any;
  minDate = new Date(2000, 0, 1);
  maxDate:Date;
  EMAIL = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$";
  BloodGroup =  [{name:"A+",value:'A+'},{name:"B+",value:'B+'}];
  idSchool:number=1;
  constructor(private studentInfoSerive:StudentInfoService, private commonService:CommonService,
    private activatedRoute:ActivatedRoute,private router:Router) {
      
      const currentYear = new Date().getFullYear();
      this.maxDate = new Date(currentYear+1,0,1)

      this.activatedRoute.queryParams.subscribe(params =>{
        console.log(params);
  this.name = params['name'];
  this.rollno = params['rollno'];
  this.dob = params['dob'];
  this.age = params['age'];
  this.bloodgrp = params['bloodgrp'];
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
  
      });
   
     }

    ngOnInit() {
      this.form = new FormGroup({
        name:new FormControl(this.name, [Validators.required,Validators.pattern("[A-Za-z ]*")]),
        // businessLogo: new FormControl(null, [Validators.required]),
        // businessLogoUrl: new FormControl(null, [Validators.required]),
        idStandard:new FormControl(null, [Validators.required]),
        idDivision:new FormControl(null, [Validators.required]),
        rollno:new FormControl(this.rollno, [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10)]),
        gender:new FormControl(null, [Validators.required]),
        age:new FormControl(this.age, [Validators.required,Validators.pattern("^[0-9]*$")]),
        dob:new FormControl(this.dob, [Validators.required]),
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
      // console.log("idStudent:::",this.idStudent);
  }

    getStandardData(){
      this.studentInfoSerive.getStandred({idSchool:this.idSchool}).subscribe((res:any) =>{
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

    onChangeStandred(idStandard){
      
      this.studentInfoSerive.getDivision(idStandard).subscribe( (res:any) =>{
        this.divisionData = res.data;
       
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
      this.fileName = file.name;
      console.log("::::::::::::::::::",this.fileName)
    }
       selectFile(event) {
      this.selectedFiles = event.target.files;
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
          dob:this.form.get('dob').value,
          email:this.form.get('email').value,
          pmobileno:this.form.get('pmobileno').value,
          smobileno:this.form.get('smobileno').value,
          address:this.form.get('address').value,
          subjects:this.form.get('subjects').value,
          academicyear:this.form.get('academicyear').value,
          idParent:this.form.get('idParent').value,
          bloodgrp:this.form.get('bloodgrp').value,
          semail:this.form.get('semail').value,
          address2:this.form.get('address2').value,
          emergancyConntact:this.form.get('emergancyConntact').value,
          idNationality:this.form.get('nationality').value,
          idCountry:this.form.get('country').value,
          idState:this.form.get('state').value,
          idCity:this.form.get('city').value,
          profileurl:'https://mytestschool.s3.ap-south-1.amazonaws.com/s3%3A//mytestschool/pics/'+`${this.fileName}`,
  
        };
        return body;
      }

      dobClick(e){
        // this.form.get('dob').setValue(moment(e).format('YYYY-MM-DD'));
        let now = moment();
        const age = now.diff(moment(e),'year');
        this.form.get('age').setValue(age);
      }
      
      submit(){
        if(this.form.valid){
        const body = this.makeBody();
        this.studentInfoSerive.studentInformation(body).subscribe(res =>{
        this.commonService.openSnackbar('Student Information Submitted Succesfully','Done');
        this.router.navigate(['dashboard/student-details']);
        });
      }
      else{
       this.commonService.openSnackbar('Please Fill All Filed','Warning');
      }
       
      }
      
      back(){
        this.router.navigate(['../../student-details'],{relativeTo:this.activatedRoute});
      }
     
  

}
