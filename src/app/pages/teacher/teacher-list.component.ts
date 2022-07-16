import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';
import { StudentInfoService } from '../services/student-info.service';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit {

   
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  teacherData:any;
  dataSource:any;
  displayedColumns: string[] = ['name','education','contact' ,'whatsappno','email','edit','delete'];
  idSchoolDetail:number = 1;
  selectedValue=11;
  
  constructor(private router:Router,private studentInfoSerive:StudentInfoService,private dialog: MatDialog,
    private route:ActivatedRoute,private commonService:CommonService) {
    
  }
  ngOnInit(): void {
    this.getTeacherData();
  } 


  getTeacherData(){
    this.studentInfoSerive.getAllTeacher().subscribe((res:any) => {
      this.teacherData = res.data;
      this.dataSource = new MatTableDataSource(this.teacherData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
     

  editTeacher(teacherData: any):void {
      console.log(teacherData);
      this.router.navigate(['./add-teacher'],
      {
        queryParams:{"id":teacherData.idTeacher
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
      const dialogRef =  this.commonService.openDialog('Delete Confirmation','Are you sure that you want to delete Teacher Details?');
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
    addTeacher(){
      this.router.navigate(['add-teacher'],{relativeTo:this.route});
    }
 
  
}