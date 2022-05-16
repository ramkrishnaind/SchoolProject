import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from './../../dashboard/student-info/student-info.service';
import { CommonService } from 'src/app/shared/common.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.scss']
})
export class DivisionComponent implements OnInit {
  form: FormGroup;
  displayedColumns: string[] = ['name'];
  standredData: any;
  standredName;
  divisionData;
  divisionName;
  dataSource = new MatTableDataSource();
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService) { }


  ngOnInit(): void {
    this.form = new FormGroup({
      name:new FormControl(null, [Validators.required]),
      idStandard:new FormControl(null,[Validators.required])
      });
      this.studentInfoSerive.getStandred().subscribe(res =>{
        this.standredData = res;
        this.standredName = this.standredData.data;
       
      });
  }
  onChangeStandred(idStandard){
    
    this.studentInfoSerive.getDivision(idStandard).subscribe( res =>{
      this.divisionData = res;
      this.divisionName = this.divisionData.data;
      this.dataSource = new MatTableDataSource(this.divisionName);
     
    });
  }
  makeBody(){
    const body ={
      name:this.form.get('name').value,
      idStandard:this.form.get('idStandard').value
     };
    return body;
  }
  addDivision(){
    if(this.form.valid){
      const body = this.makeBody();
      this.studentInfoSerive.division(body).subscribe(res =>{
        this.commonService.openSnackbar('Division Submitted Successfully','Done');
        this.form.reset();
      });
    }
    else{
      this.commonService.openSnackbar('Please Fill All Field','Warning');
    }
  }

}
