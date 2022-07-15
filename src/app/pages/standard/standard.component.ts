import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../services/student-info.service';
import { CommonService } from 'src/app/shared/common.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { elementAt } from 'rxjs-compat/operator/elementAt';

@Component({
  selector: 'app-standard',
  templateUrl: './standard.component.html',
  styleUrls: ['./standard.component.scss']
})
export class StandardComponent implements OnInit {


  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  form: FormGroup;
  displayedColumns: string[] = ['name','edit','delete'];
  standardName=[];
  dataSource:any;
  idSchool:number=1
  changeInStandardValue:string;
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
     name:new FormControl(null, [Validators.required])
     });
     
     this.studentInfoSerive.getStandard({idSchool:this.idSchool}).subscribe((res:any) =>{
      this.standardName = res.data;
      this.standardName.forEach((data)=>{
        data.edit = false;
      })
      this.dataSource = new MatTableDataSource(this.standardName);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  changeStandard(event){
  this.changeInStandardValue = event.target.value
  }

  onUpdate(e){
    e.edit = false;
   console.log(e);
   const body ={
      "idStandard": e.idStandard,
      "name": this.changeInStandardValue,
      "idSchoolDetails": e.idSchoolDetails
   }
   this.studentInfoSerive.standard(body).subscribe(res =>{
    e.name = this.changeInStandardValue;
    this.commonService.openSnackbar('Standard Updated Successfully','Done');
  });

  }

  onEdit(ele){
    console.log(ele);
    console.log(this.standardName);
    ele.edit = true;
  }

  onDelete(data){
    console.log(data);
    const dialogRef =  this.commonService.openDialog('Delete Confirmation','Are you sure that you want to delete Standard?');
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const body ={
          "idStandard": data.idStandard,
          "name": data.name,
          "idSchoolDetails": data.idSchoolDetails
       }
       this.studentInfoSerive.deleteStandard(body).subscribe((res:any) =>{
        this.commonService.openSnackbar('Standard Deleted Successfully','Done');
        const index = this.dataSource.data.findIndex(data => data.idStandard === res.idStandard);
        if( index != -1){
          this.dataSource.data.splice(index, 1);
          this.paginator.length = this.dataSource.data.length;
          this.dataSource.paginator = this.paginator
          this.table.renderRows();
        }
      });
      }
    });
   
  
  }

  onCancel(data){
    data.edit = false;
  }

  makeBody(){
    const body ={
      "name":this.form.get('name').value,
      "idSchoolDetails":this.idSchool
     };
    return body;
  }
  addStandard(){
    if(this.form.valid){
      const body = this.makeBody();
      this.studentInfoSerive.standard(body).subscribe(res =>{
        this.dataSource.data.push(res);
        this.paginator.length = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator
        this.table.renderRows();
        this.commonService.openSnackbar('Standard Submitted Successfully','Done');
        this.form.reset();
      });
    }
    else{
      this.commonService.openSnackbar('Please Fill All Field','Warning');
    }
  }

}
