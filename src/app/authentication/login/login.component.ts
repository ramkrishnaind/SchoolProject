import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../shared/common.service';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  hide: boolean=true;
  constructor(
    private formBuilder: FormBuilder,private router:Router,private authservice:AuthenticationService,
    private commonService:CommonService) {
      if (this.authservice.currentUserValue) { 
        this.router.navigate(['pages/dashboard']);
    }
  }

  ngOnInit(): void {
    const PAT_EMAIL = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$";//"^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$" use any
    // const PAT_PASSWORD = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required,Validators.pattern(PAT_EMAIL)]),
      password: new FormControl(null, [Validators.required,Validators.minLength(4)])
    })
  }

  makeBody(){
    const body ={
      email:this.form.get('email').value,
      password:this.form.get('password').value,
    };
    return body;
  }

  onLogin(){
    if(this.form.valid){
      const body = this.makeBody();
      this.authservice.login(body.email,body.password).subscribe(res =>{
        if(res && !res.error){
          this.authservice.idSchool = res.user.idSchool;
          this.router.navigate(['pages/dashboard']);
        }
        else{
          this.commonService.openSnackbar('username or password entered incorrectly','Warning');
        }
    // this.commonService.openSnackbar('Student Information Submitted Succesfully','Done');
    });
  }
  else{
   this.commonService.openSnackbar('Please Fill All Filed','Warning');
  }
   
  }

 


}
