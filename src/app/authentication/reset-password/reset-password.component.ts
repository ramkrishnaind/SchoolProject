import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

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
  constructor(private formBuilder: FormBuilder){
    this.hide1 = true;
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    })
  }
  resetPassword(): void {
    if (this.form.valid) {
    this.otpsnt = true;
    }
  }
}
