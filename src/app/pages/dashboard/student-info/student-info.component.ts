import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {StudentInfoService} from './student-info.service';
import {CommonService} from './../../../shared/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.scss']
})
export class StudentInfoComponent implements OnInit {
  form: FormGroup;
  fileName;
  selectedFiles: FileList;
  logoError: boolean;
  nationality = [{name:"Indian",value:'Indian'},{name:"Japnies",value:'Japnies'}];
  country = [{name:"India",value:'India'},{name:"Japan",value:'Japan'}];
  state =  [{name:"Maharastra",value:'Maharastra'},{name:"Gurjat",value:'Gurjat'}];
  city =  [{name:"Nagpur",value:'Nagpur'},{name:"Surat",value:'Surat'}];
  gender = [{ name: 'All', value: 1 }, { name: 'Male', value: 'Male'}, { name: 'Female', value:'Female' }, { name: 'Others', value: 'Others' }];
  standredData: any;
  standredName;
  divisionData;
  divisionName;
  parentName;
  constructor(private studentInfoSerive:StudentInfoService, private commonService:CommonService,
    private route:Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      name:new FormControl(null, [Validators.required]),
      businessLogo: new FormControl(null, [Validators.required]),
      businessLogoUrl: new FormControl(null, [Validators.required]),
      idStandard:new FormControl(null, [Validators.required]),
      idDivision:new FormControl(null, [Validators.required]),
      rollno:new FormControl(null, [Validators.required]),
      gender:new FormControl(null, [Validators.required]),
      age:new FormControl(null, [Validators.required]),
      dob:new FormControl(null, [Validators.required]),
      email:new FormControl(null, [Validators.required]),
      pmobileno:new FormControl(null, [Validators.required]),
      smobileno:new FormControl(null, [Validators.required]),
      address:new FormControl(null, [Validators.required]),
      subjects:new FormControl(null, [Validators.required]),
      academicyear:new FormControl(null, [Validators.required]),
      idParent:new FormControl(null, [Validators.required]),
      bloodgrp:new FormControl(null, [Validators.required]),
      semail:new FormControl(null, [Validators.required]),
      address2:new FormControl(null, [Validators.required]),
      emergancyConntact:new FormControl(null, [Validators.required]),
      nationality:new FormControl(null, [Validators.required]),
      country:new FormControl(null, [Validators.required]),
      state:new FormControl(null, [Validators.required]),
      city:new FormControl(null, [Validators.required]),
    });
    this.studentInfoSerive.getStandred().subscribe(res =>{
    this.standredData = res;
    this.standredName = this.standredData.data;
  });
  
    this.studentInfoSerive.parentDetails().subscribe(res =>{
     this.parentName = res;
    });
  
  
  }
  onChangeStandred(idStandard){
    
    this.studentInfoSerive.getDivision(idStandard).subscribe( res =>{
      this.divisionData = res;
      this.divisionName = this.divisionData.data;
     
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
        nationality:this.form.get('nationality').value,
        country:this.form.get('country').value,
        state:this.form.get('state').value,
        city:this.form.get('city').value,
        profileurl:'https://mytestschool.s3.ap-south-1.amazonaws.com/s3%3A//mytestschool/pics/'+`${this.fileName}`,

      };
      return body;
    }
    submit(){
      if(this.form.valid){
      const body = this.makeBody();
      this.studentInfoSerive.studentInformation(body).subscribe(res =>{
      this.commonService.openSnackbar('Student Information Submitted Succesfully','Done');
      });
    }
    else{
     this.commonService.openSnackbar('Please Fill All Filed','Warning');
    }
     
    }
    back(){
      this.route.navigate(['/dashboard']);
    }
  
}
