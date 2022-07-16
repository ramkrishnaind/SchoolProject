import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';
import { StudentInfoService } from '../../services/student-info.service';
import { ParentService } from '../parent.service';

@Component({
  selector: 'app-add-parent-detail',
  templateUrl: './add-parent-detail.component.html',
  styleUrls: ['./add-parent-detail.component.scss']
})
export class AddParentDetailComponent implements OnInit {

  @Input() newItemEvent: string;
  logoError: boolean;
  form: FormGroup;
  fileName;
  gender = [{ name: 'Male', value: 'male'}, { name: 'Female', value:'female' }, { name: 'Others', value: 'others' }];
  role = [{ name: "Admin", value: 3 },{ name: "Teacher", value: 2 }, { name: "Parent", value: 1 },];
  nationality = [];
  country = [];
  state =  [];
  city =  [];
  EMAIL = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$";
  selectedFiles: FileList;
  parentImageDataUploadToS3;
  idSchool:number=1;
  idToNavigate;
  parentEditData;
  constructor(private parentService:ParentService,private commonService:CommonService,
    private studentInfoSerive:StudentInfoService,
    private router:Router,private dialog: MatDialog,
    private route:ActivatedRoute) { 
      this.idToNavigate = +this.route.snapshot.queryParams['idParent'] || 0;
      if(this.idToNavigate != 0){
        this.getSpecificParentData();
      }
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      parentName:new FormControl(null, [Validators.required,Validators.pattern("[A-Za-z ]*")]),
      businessLogo: new FormControl(null, [Validators.required]),
      businessLogoUrl: new FormControl(null, [Validators.required]),
      address1:new FormControl(null, [Validators.required]),
      address2:new FormControl(null,[Validators.required]),
      mobilenumber:new FormControl(null, [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10),Validators.minLength(10)]),
      secMobilnumber:new FormControl(null, [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10),Validators.minLength(10)]),
      emgMobilenumber:new FormControl(null, [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10),Validators.minLength(10)]),
      email:new FormControl(null, [Validators.required,Validators.pattern(this.EMAIL)]),
      secEmail:new FormControl(null, [Validators.required,Validators.pattern(this.EMAIL)]),
      gender:new FormControl(null, [Validators.required]),
      role:new FormControl(1, [Validators.required]),
      nationality:new FormControl(null, [Validators.required]),
      country:new FormControl(null, [Validators.required]),
      state:new FormControl(null, [Validators.required]),
      city:new FormControl(null, [Validators.required]),
      postelCode:new FormControl(null, [Validators.required])
    });
   
    this.getNationalityData();
    this.getCountryData();
  }

  getSpecificParentData(){
    this.studentInfoSerive.parentDetails().subscribe((res:any) =>{
      res.forEach(data => {
        if(data.idparent === this.idToNavigate){
          this.parentEditData = data;
          console.log(this.parentEditData);
          this.updateValue();
        }
      });
     });
  }

  updateValue(){
    this.form.get('parentName').setValue(this.parentEditData.name);
    this.form.get('address1').setValue(this.parentEditData.address1);
    this.form.get('address2').setValue(this.parentEditData.address2);
    this.form.get('mobilenumber').setValue(this.parentEditData.pmobile_no);
    this.form.get('secMobilnumber').setValue(this.parentEditData.smobileno);
    this.form.get('emgMobilenumber').setValue(this.parentEditData.emergencyNo);
    this.form.get('email').setValue(this.parentEditData.pemail);

    this.form.get('secEmail').setValue(this.parentEditData.semail);
    this.form.get('gender').setValue(this.parentEditData.gender);

    this.form.get('role').setValue(this.parentEditData.idRole);
    this.form.get('nationality').setValue(this.parentEditData.idNationality);
    this.form.get('country').setValue(this.parentEditData.idCountry);
    this.getStateData();
    this.form.get('state').setValue(this.parentEditData.idState);
    this.getCityData();
    this.form.get('city').setValue(this.parentEditData.idCity);

    this.form.get('postelCode').setValue(this.parentEditData.zipcode);
    // this.form.get('parentName').setValue(this.parentData.name);
  }

  getNationalityData(){
    this.studentInfoSerive.getNationality().subscribe((res:any) =>{
      this.nationality = res;
      if(this.idToNavigate === 0){
      this.nationality.forEach((data:any)=>{
           if(data.name === 'INDIAN'){
            this.form.get('nationality').setValue(data.idNationality);
           }
      });
    }
    })
  }
  getCountryData(){
    this.studentInfoSerive.getCountry().subscribe((res:any) =>{
      this.country = res;
      if(this.idToNavigate === 0){
      this.country.forEach((data:any)=>{
        if(data.name === 'INDIA'){
         this.form.get('country').setValue(data.idCountry);
        }
   });
  }
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
    setTimeout(() => {

      this.parentService.getFile().subscribe((uploadingData) => {
        // this.CommonService.hideSppiner();
        console.log(uploadingData);
        this.parentImageDataUploadToS3 =uploadingData.data;
        console.log(this.parentImageDataUploadToS3);
        if (uploadingData.status == "error") {
          this.commonService.openSnackbar(uploadingData.message,uploadingData.status);
        } else {
          this.commonService.openSnackbar(uploadingData.message,'Done');
        }
        // this.chatBubbleForm.controls['avatarImage'].setValue(resData.data, { emitModelToViewChange: false });
        // this.imageUrl = this.chatBubbleForm.controls['avatarImage'].value;
      });

    },1);
  }
     selectFile(event) {
    this.selectedFiles = event.target.files;
    }
   makeBody(){
     const body = {
      "name":this.form.get('parentName').value,
      "address1":this.form.get('address1').value,
      "address2":this.form.get('address2').value,
      "pmobile_no":this.form.get('mobilenumber').value,
      "smobileno":this.form.get('secMobilnumber').value,
      "emergencyNo":this.form.get('emgMobilenumber').value,
      "pemail":this.form.get('email').value,
      "semail":this.form.get('secEmail').value,
      "gender":this.form.get('gender').value,
      "idRole":this.form.get('role').value,
      "idNationality":this.form.get('nationality').value,
      "idCountry":this.form.get('country').value,
      "idState":this.form.get('state').value,
      "idCity":this.form.get('city').value,
      "zipcode":this.form.get('postelCode').value,
      "profilepicUrl":this.parentImageDataUploadToS3.Location,
      "idSchoolDetails":this.idSchool
     };
     return body;
   }
   submit(){
     if(this.form.valid){
     const body = this.makeBody();
     this.parentService.parentDetails([body]).subscribe(res =>{
      console.log(res);
      this.commonService.openSnackbar("Parent Details Submitted Suceesfully",'Done');
     });
    }
    else{
       this.commonService.openSnackbar('Please Fill All Field','Warning');
    }
   }

   back(){
    this.router.navigate(['../../parent'],{relativeTo:this.route});
   }

}
