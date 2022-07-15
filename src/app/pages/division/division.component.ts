import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../services/student-info.service';
import { CommonService } from 'src/app/shared/common.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.scss']
})
export class DivisionComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  form: FormGroup;
  displayedColumns: string[] = ['name'];
  standardData: any;
  standardName;
  divisionName=[];
  dataSource:any;
  idStandardForDataView:number;
  idSchool:number=1
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService) { }


  ngOnInit(): void {
    this.form = new FormGroup({
      name:new FormControl(null, [Validators.required]),
      idStandard:new FormControl(null,[Validators.required])
      });
      this.studentInfoSerive.getStandard({idSchool:this.idSchool}).subscribe(res =>{
        this.standardData = res;
        this.standardName = this.standardData.data;
       
      });
  }
  onChangeStandard(idStandard){
    this.idStandardForDataView = idStandard.value
    this.studentInfoSerive.getDivision(idStandard,this.idSchool).subscribe( (res:any) =>{
      this.divisionName = res.data
      this.dataSource = new MatTableDataSource(this.divisionName);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
     
    });
  }
  makeBody(){
    const body ={
      name:this.form.get('name').value,
      idStandard:this.form.get('idStandard').value,
      "idSchoolDetails":this.idSchool
     };
    return body;
  }
  addDivision(){
    if(this.form.valid){
      const body = this.makeBody();
      this.studentInfoSerive.division(body).subscribe((res:any) =>{
        if(this.idStandardForDataView === res.idStandard){
          this.dataSource.data.push(res);
          this.table.renderRows();
          this.paginator.length = this.dataSource.data.length;
          this.dataSource.paginator = this.paginator

        }
        this.commonService.openSnackbar('Division Submitted Successfully','Done');
        this.form.reset();
      });
    }
    else{
      this.commonService.openSnackbar('Please Fill All Field','Warning');
    }
  }

}
