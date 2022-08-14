import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private formBuilder: FormBuilder,private router:Router,private authservice:AuthenticationService) {
      if (this.authservice.currentUserValue) { 
        this.router.navigate(['pages/dashboard']);
    }
  }

  ngOnInit(): void {
    const PAT_EMAIL = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$";//"^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$" use any
    // const PAT_PASSWORD = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required,Validators.pattern(PAT_EMAIL)]),
      password: new FormControl(null, [Validators.required,Validators.minLength(6)])
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
    // if(this.form.valid){
      const body = this.makeBody();
      this.authservice.login(body.email,body.password).subscribe(res =>{
        console.log(res);
        this.authservice.idSchool = res.idSchool;
        this.router.navigate(['pages/dashboard']);
    // this.commonService.openSnackbar('Student Information Submitted Succesfully','Done');
    });
  // }
  // else{
  //  this.commonService.openSnackbar('Please Fill All Filed','Warning');
  // }
   
  }

 


}
