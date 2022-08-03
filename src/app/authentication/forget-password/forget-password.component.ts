import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private router:Router) { }

  form: FormGroup;

  ngOnInit(): void {
    const PAT_EMAIL = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$";//"^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$" use any

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required,Validators.pattern(PAT_EMAIL)]),
    })
  }

  makeBody(){
    const body ={
      email:this.form.get('email').value,
    };
    return body;
  }

  getOTP(){
    this.router.navigate(['./otp']);
  //   if(this.form.valid){
  //     const body = this.makeBody();
  //   // this.studentInfoSerive.studentInformation(body).subscribe(res =>{
  //   // this.commonService.openSnackbar('Student Information Submitted Succesfully','Done');
  //   // });
  // }
  // else{
  // //  this.commonService.openSnackbar('Please Fill All Filed','Warning');
  // }
   
  }

}
