import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ParentService} from './parent.service';
import {CommonService} from '../../shared/common.service';
import { StudentInfoService } from '../services/student-info.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-parent-list',
  templateUrl: './parent-list.component.html',
  styleUrls: ['./parent-list.component.scss']
})
export class ParentListComponent implements OnInit {
  
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
 parentData:any;
  dataSource:any;
  displayedColumns: string[] = ['name','address1','address2' ,'gender','pemail','pmobile_no','smobileno','action'];
  idSchoolDetail:number = 1;
  selectedValue=11;
  
  constructor(private router:Router,private studentInfoSerive:StudentInfoService,private dialog: MatDialog,
    private route:ActivatedRoute,private commonService:CommonService) {
    
  }
  ngOnInit(): void {
    this.getParentData();
  } 
     
  getParentData(){
    this.studentInfoSerive.parentDetails().subscribe(res =>{
      this.parentData = res;
      this.dataSource = new MatTableDataSource(this.parentData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
     });
  }

    editParent(parentData: any):void {
      console.log(parentData);
      this.router.navigate(['./add-parent'],
      {
        queryParams:{"idParent":parentData.idparent
        // queryParams:{"idStudent":studentName.idStudent,"name":studentName.name,"rollno":studentName.rollno,"dob":studentName.dob,
        // "age":studentName.age,"bloodgrp":studentName.bloodgrp,"pmobileno":studentName.pmobileno,"smobileno":studentName.smobileno,
        //  "emergancyConntact":studentName.emergancyConntact,"email":studentName.email,"semail":studentName.semail,
        //   "subjects":studentName.subjects,"academicyear":studentName.academicyear,"address":studentName.address,
        //   "address2":studentName.address2,"idParent":studentName.idParent,"idStandard":studentName.idStandard,"idDivision":studentName.idDivision,
        //   "gender":studentName.gender,"idNationality":studentName.nationality
        //  },
      },
         relativeTo :this.route
       }
       
       );
      
    }

    onDelete(data){
      console.log(data);
      const dialogRef =  this.commonService.openDialog('Delete Confirmation','Are you sure that you want to delete Parent Details?');
      dialogRef.afterClosed().subscribe(result => {
        if(result){
        //   const body ={
        //     ...data
        //  }
        //  this.studentInfoSerive.delete('subject',body).subscribe((res:any) =>{
        //   this.commonService.openSnackbar('Parent Data Deleted Successfully','Done');
        //   const index = this.dataSource.data.findIndex(data => data.idSubject === res.idDivision);
        //   if( index != -1){
        //     this.dataSource.data.splice(index, 1);
        //     this.paginator.length = this.dataSource.data.length;
        //     this.dataSource.paginator = this.paginator
        //     this.table.renderRows();
        //   }
        // });

        }
      });

    }
    addParent(){
      this.router.navigate(['add-parent'],{relativeTo:this.route});
    }
}
