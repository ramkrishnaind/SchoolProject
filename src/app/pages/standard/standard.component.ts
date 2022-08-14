import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../services/student-info.service';
import { CommonService } from 'src/app/shared/common.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AuthenticationService } from '../../service/authentication.service';
import {standard} from '../models/commonmodel'

class standardExtended extends standard{
  edit:boolean;
}

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
  displayedColumns: string[] = ['name','action'];
  standardData:standardExtended[]=[];
  dataSource:any;
  idSchool:number;
  changeInStandardValue:string;
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,private authservice:AuthenticationService) {
    this.idSchool = this.authservice.idSchool;
   }

  ngOnInit(): void {
    this.form = new FormGroup({
     name:new FormControl(null, [Validators.required])
     });
     
     this.studentInfoSerive.getStandard({idSchool:this.idSchool}).subscribe((res:any) =>{
      this.standardData = res.data;
      this.standardData.forEach((data)=>{
        data.edit = false;
      })
      this.dataSource = new MatTableDataSource(this.standardData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  changeStandard(event){
  this.changeInStandardValue = event.target.value
  }

  onUpdate(e){
    e.edit = false;
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
    ele.edit = true;
  }

  onDelete(data){
    const dialogRef =  this.commonService.openDialog('Delete Confirmation','Are you sure that you want to delete Standard?');
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const body ={
          "idStandard": data.idStandard,
          "name": data.name,
          "idSchoolDetails": data.idSchoolDetails
       }
       this.studentInfoSerive.delete('standard',body).subscribe((res:any) =>{
         const index = this.dataSource.data.findIndex(data => data.idStandard === res.data.idStandard);
         if( index != -1){
           this.dataSource.data.splice(index, 1);
           this.paginator.length = this.dataSource.data.length;
           this.dataSource.paginator = this.paginator
           this.table.renderRows();
          }
          this.commonService.openSnackbar('Standard Deleted Successfully','Done');
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
      });
    }
    else{
      this.commonService.openSnackbar('Please Fill All Field','Warning');
    }
  }

}
