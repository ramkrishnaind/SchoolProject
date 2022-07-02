import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  otpsnt: boolean;
  form: FormGroup;
  hide: boolean;
  hide1: boolean;
  constructor(private formBuilder: FormBuilder,private router:Router){
    this.hide1 = true;
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      password: new FormControl(null, [Validators.required,Validators.minLength(6)]),
      confirmPassword: new FormControl(null, [Validators.required,Validators.minLength(6)]),
      
    })
  }
  resetPassword(): void {
    this.router.navigate(['./dashboard']);
    if (this.form.valid) {
    this.otpsnt = true;
    }
  }
}
