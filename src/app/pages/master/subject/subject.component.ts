import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from './../../dashboard/student-info/student-info.service';
import { CommonService } from 'src/app/shared/common.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {
  form: FormGroup;
  displayedColumns: string[] = ['name'];
  standredData: any;
  standredName;
  dataSource = new MatTableDataSource();
  subjectData;
  subjectname;
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
  onChangeSubject(idStandard){
    
    this.studentInfoSerive.getAllSubject(idStandard).subscribe( res =>{
      this.subjectData = res;
      this.subjectname = this.subjectData.data;
      this.dataSource = new MatTableDataSource(this.subjectname);
      console.log("::::::::::",this.subjectname)
     
    });
  }
  makeBody(){
    const body ={
      name:this.form.get('name').value,
      idStandard:this.form.get('idStandard').value
     };
    return body;
  }
  addSubject(){
    if(this.form.valid){
      const body = this.makeBody();
      this.studentInfoSerive.subject(body).subscribe(res =>{
        this.commonService.openSnackbar('Subject Submitted Successfully','Done');
        this.form.reset();
      });
    }
    else{
      this.commonService.openSnackbar('Please Fill All Field','Warning');
    }
  }
}
