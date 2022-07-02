import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { ConfirmPasswordDirective } from '../../shared/directives/index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.scss']
})
export class OtpVerifyComponent implements OnInit {
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;

  hide: boolean;
  form: FormGroup;
  submit = false;
  otp: string;
  //matcher = new ConfirmPasswordDirective();
  config = {
    allowNumbersOnly:true,
    length: 6,
  };
  constructor(private formBuilder: FormBuilder, private router: Router) { 
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({ 
      password: ['', [Validators.required]],
       confirmPassword: ['']}, 
       { validator: this.done });
  }

  done(group: FormGroup) {

    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true };


  }

  onOtpChange(otp) {
    this.otp = otp;
  }

  onSubmit(){
    this.router.navigate(['./reset-password']);
  }

}
