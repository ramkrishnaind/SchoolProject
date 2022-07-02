import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../services/student-info.service';
import { CommonService } from 'src/app/shared/common.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  form: FormGroup;
  displayedColumns: string[] = ['name'];
  standredData: any;
  standredName;
  subjectname;
  dataSource:any;
  idStandardForSubjectView:number;
  idSchool:number=1
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name:new FormControl(null, [Validators.required]),
      idStandard:new FormControl(null,[Validators.required])
      });

      this.studentInfoSerive.getStandred({idSchool:this.idSchool}).subscribe(res =>{
        this.standredData = res;
        this.standredName = this.standredData.data;
       
      });
      
  }
  onChangeSubject(idStandard){
    this.idStandardForSubjectView = idStandard.value
    this.studentInfoSerive.getAllSubject(this.idStandardForSubjectView,this.idSchool).subscribe( (res:any) =>{
      this.subjectname = res.data
      this.dataSource = new MatTableDataSource(this.subjectname);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
     
    });
  }
  makeBody(){
    const body =[{
      name:this.form.get('name').value,
      standard:this.studentInfoSerive.getNameBasedonDataAndId(this.standredName,this.form.get('idStandard').value,'idStandard','name'),
      schoolDetails:"SBPCOE"
     }];
    return body;
  }
  addSubject(){
    if(this.form.valid){
      const body = this.makeBody();
      this.studentInfoSerive.subject(body).subscribe((res:any) =>{
        if(this.idStandardForSubjectView === res.idStandard){
          this.dataSource.data.push(res);
          this.table.renderRows();
          this.paginator.length = this.dataSource.data.length;
          this.dataSource.paginator = this.paginator

        }
        this.commonService.openSnackbar('Subject Submitted Successfully','Done');
        this.form.reset()
      });
    }
    else{
      this.commonService.openSnackbar('Please Fill All Field','Warning');
    }
  }
}
