import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from './../../dashboard/student-info/student-info.service';
import { CommonService } from 'src/app/shared/common.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-standred',
  templateUrl: './standred.component.html',
  styleUrls: ['./standred.component.scss']
})
export class StandredComponent implements OnInit {
  form: FormGroup;
  displayedColumns: string[] = ['name'];
  standredData: any;
  standredName;
  dataSource = new MatTableDataSource();
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
     name:new FormControl(null, [Validators.required])
     });
     
     this.studentInfoSerive.getStandred().subscribe(res =>{
      this.standredData = res;
      this.standredName = this.standredData.data;
      this.dataSource = new MatTableDataSource(this.standredName);
    });
  }
  makeBody(){
    const body ={
      name:this.form.get('name').value,
     };
    return body;
  }
  addStandred(){
    if(this.form.valid){
      const body = this.makeBody();
      this.studentInfoSerive.standred(body).subscribe(res =>{
        this.commonService.openSnackbar('Standred Submitted Successfully','Done');
        this.form.reset();
      });
    }
    else{
      this.commonService.openSnackbar('Please Fill All Field','Warning');
    }
  }

}
