import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';
import { StudentInfoService } from '../student-info/student-info.service';

@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.scss']
})
export class FeesComponent implements OnInit {
  feeType: any;
  form: FormGroup;
  form1: FormGroup;
  standredName;
  standredData: any;
  studentName;
  studentData;
  divisionData;
  divisionName;
  constructor(private route:Router,private studentInfoSerive:StudentInfoService,private commonService:CommonService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      idStandard:new FormControl(null, [Validators.required]),
      idFeesType:new FormControl(null,[Validators.required]),
      duedate:new FormControl(null,[Validators.required]),
      discription:new FormControl(null,[Validators.required]),
      totalfees:new FormControl(null,[Validators.required])
    });
    this.form1 = new FormGroup({
      idStudent:new FormControl(null,[Validators.required]),
      paid:new FormControl(null,[Validators.required]),
      discription:new FormControl(null,[Validators.required]),
      idFeesType:new FormControl(null,[Validators.required]),
      idStandard:new FormControl(null,[Validators.required]),
      date:new FormControl(null,[Validators.required]),
      paymentmethod: new FormControl(null,[Validators.required]),
      reference: new FormControl(null,[Validators.required]),
      status: new FormControl(null,[Validators.required])
    });
    this.studentInfoSerive.getStandred().subscribe(res =>{
      this.standredData = res;
      this.standredName = this.standredData.data;
     
    });
    this.studentInfoSerive.getFeesType().subscribe(res =>{
     this.feeType = res;
     });
     this.studentInfoSerive.getPaymentType().subscribe(res =>{
       console.log("Paymeny Type::::::",res);
     })
  }
//   date: "2020-06-01T00:00:00.000+0000"
// idPaymentType: 1
// idStudent: 1
// paymentmethod: "Net Banking"
// reference: "TXN2344822533"
// status: "paid"
  onChangeStandred(idStandard){
    
    this.studentInfoSerive.getDivision(idStandard).subscribe( res =>{
      this.divisionData = res;
      this.divisionName = this.divisionData.data;
     
    });
   }
   onChangeDivision(idStandard,idDivision){
    this.studentInfoSerive.getAllStudent(idStandard,idDivision).subscribe(res =>{
      this.studentData = res;
     this.studentName = this.studentData.data;
     });
   }
  makeBody(){
    const body ={
      idStandard:this.form.get('idStandard').value,
      idFeesType:this.form.get('idFeesType').value,
      duedate:this.form.get('duedate').value,
      discription:this.form.get('discription').value,
      totalfees:this.form.get('totalfees').value,
    };
    return body;
  }
  feeStucture(){
    if(this.form.valid){
      const body = this.makeBody();
      this.studentInfoSerive.feesStucture(body).subscribe(res =>{
      this.commonService.openSnackbar('Fees Sturucture Submitted Successfully','Done');
      })
    }else{
      this.commonService.openSnackbar('Please fill all fields','Warning');
    }
  }

  makeBodyForDetails(){
    const body ={
      idStudent:this.form1.get('idStudent').value,
      paid:this.form1.get('paid').value,
      discription:this.form1.get('discription').value,
      idFeesType:this.form1.get('idFeesType').value,
      idStandard:this.form1.get('idStandard').value,
      date:this.form1.get('date').value,
      paymentmethod: this.form1.get('paymentmethod').value,
      reference: this.form1.get('reference').value,
      status:this.form1.get('status').value,
    };
    return body;
  }
  feeDetails(){
   //
      const body = this.makeBodyForDetails();
      this.studentInfoSerive.feesDetails(body).subscribe(res =>{
        this.commonService.openSnackbar('Fees Details Submitted Successfully','Done');
      })
   // }else{
    //  this.commonService.openSnackbar('Please fill all fields','Warning');
   // }
  }
  back(){
    this.route.navigate(['/dashboard']);
  }
}