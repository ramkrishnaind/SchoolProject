import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../services/student-info.service';
import { CommonService } from 'src/app/shared/common.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-standred',
  templateUrl: './standard.component.html',
  styleUrls: ['./standard.component.scss']
})
export class StandardComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  form: FormGroup;
  displayedColumns: string[] = ['name'];
  standredName=[];
  dataSource:any;
  idSchool:number=1
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
     name:new FormControl(null, [Validators.required])
     });
     
     this.studentInfoSerive.getStandred({idSchool:this.idSchool}).subscribe((res:any) =>{
      this.standredName = res.data;
      this.dataSource = new MatTableDataSource(this.standredName);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  makeBody(){
    const body ={
      "name":this.form.get('name').value,
      "idSchoolDetails":this.idSchool
     };
    return body;
  }
  addStandred(){
    if(this.form.valid){
      const body = this.makeBody();
      this.studentInfoSerive.standred(body).subscribe(res =>{
        this.dataSource.data.push(res);
        this.paginator.length = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator
        this.table.renderRows();
        this.commonService.openSnackbar('Standred Submitted Successfully','Done');
        this.form.reset();
      });
    }
    else{
      this.commonService.openSnackbar('Please Fill All Field','Warning');
    }
  }

}
