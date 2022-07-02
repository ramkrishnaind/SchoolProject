import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../services/student-info.service';
import { CommonService } from 'src/app/shared/common.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.scss']
})
export class HolidayListComponent implements OnInit {
  form: FormGroup;
  fileName;
  selectedFiles: FileList;
  logoError: boolean;
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,
    private router:Router,private route :ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      businessLogo: new FormControl(null, [Validators.required]),
      businessLogoUrl: new FormControl(null, [Validators.required]),
      name:new FormControl(null, [Validators.required]),
      date:new FormControl(null, [Validators.required])
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
    this.studentInfoSerive.uploadFile(file);
    this.fileName = file.name;
  }
     selectFile(event) {
    this.selectedFiles = event.target.files;
    }
    makeBody(){
      const body ={
        name:this.form.get('name').value,
        date:this.form.get('date').value,
        url:'https://mytestschool.s3.ap-south-1.amazonaws.com/hollydaysPic/'+`${this.fileName}`
      };
      return body;
    }
  holidayDetails(){
    if(this.form.valid){
    const body = this.makeBody();
    this.studentInfoSerive.hoidayDetails(body).subscribe(res =>{
      this.commonService.openSnackbar('School Holiday  Submitted Successfully','Done');
      this.form.reset();
    });
  }
  else{
    this.commonService.openSnackbar('Please Fill All Field','Warning');
  }
  }
  back(){
    this.router.navigate(['../../dashboard'],{relativeTo:this.route});
  }

}
