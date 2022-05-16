import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ParentService} from './parent.service';
import {CommonService} from './../../shared/common.service';
@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss']
})
export class ParentComponent implements OnInit {
  @Input() newItemEvent: string;
  logoError: boolean;
  form: FormGroup;
  fileName;
  gender = [{ name: 'All', value: 1 }, { name: 'Male', value: 'Male'}, { name: 'Female', value:'Female' }, { name: 'Others', value: 'Others' }];
  role = [{ name: "Admin", value: 'Admin' },{ name: "Teacher", value: 'teacher' }, { name: "Parent", value: 'Parent' },];
  nationality = [{name:"Indian",value:'Indian'},{name:"Japnies",value:'Japnies'}];
  country = [{name:"India",value:'India'},{name:"Japan",value:'Japan'}];
  state =  [{name:"Maharastra",value:'Maharastra'},{name:"Gurjat",value:'Gurjat'}];
  city =  [{name:"Nagpur",value:'Nagpur'},{name:"Surat",value:'Surat'}];
  selectedFiles: FileList;
  constructor(private parentService:ParentService,private commonService:CommonService) { 
 
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      parentName:new FormControl(null, [Validators.required]),
      businessLogo: new FormControl(null, [Validators.required]),
      businessLogoUrl: new FormControl(null, [Validators.required]),
      address1:new FormControl(null, [Validators.required]),
      address2:new FormControl(null, [Validators.required]),
      mobilenumber:new FormControl(null, [Validators.required]),
      secMobilnumber:new FormControl(null, [Validators.required]),
      emgMobilenumber:new FormControl(null, [Validators.required]),
      email:new FormControl(null, [Validators.required]),
      secEmail:new FormControl(null, [Validators.required]),
      gender:new FormControl(null, [Validators.required]),
      role:new FormControl(null, [Validators.required]),
      nationality:new FormControl(null, [Validators.required]),
      counrty:new FormControl(null, [Validators.required]),
      state:new FormControl(null, [Validators.required]),
      city:new FormControl(null, [Validators.required]),
      postelCode:new FormControl(null, [Validators.required])
    });
   
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
    this.parentService.uploadFile(file);
    this.fileName = file.name;
    console.log("::::::::::",this.fileName);
  }
     selectFile(event) {
    this.selectedFiles = event.target.files;
    }
   makeBody(){
     const body = {
      name:this.form.get('parentName').value,
      address1:this.form.get('address1').value,
      address2:this.form.get('address2').value,
      pmobile_no:this.form.get('mobilenumber').value,
      smobileno:this.form.get('secMobilnumber').value,
      emergencyNo:this.form.get('emgMobilenumber').value,
      pemail:this.form.get('email').value,
      semail:this.form.get('secEmail').value,
      gender:this.form.get('gender').value,
      role:this.form.get('role').value,
      nationality:this.form.get('nationality').value,
      country:this.form.get('counrty').value,
      state:this.form.get('state').value,
      city:this.form.get('city').value,
      zipcode:this.form.get('postelCode').value,
      profilepicUrl:'https://mytestschool.s3.ap-south-1.amazonaws.com/s3%3A//mytestschool/pics/'+`${this.fileName}`,
     };
     return body;
   }
   submit(){
     if(this.form.valid){
     const body = this.makeBody();
     this.parentService.parentDetails(body).subscribe(res =>{
      this.commonService.openSnackbar("Parent Details Submitted Suceesfully",'Done');
     });
    }
    else{
       this.commonService.openSnackbar('Please Fill All Field','Warning');
    }
   }
}
