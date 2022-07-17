import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../services/student-info.service';
import * as XLSX from 'xlsx';
import { CommonService } from 'src/app/shared/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-homework-list',
  templateUrl: './homework-list.component.html',
  styleUrls: ['./homework-list.component.scss']
})
export class HomeworkListComponent implements OnInit {

  
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  form: FormGroup;
  studentData;
  standardData;
  divisionData;
  subjectData;
  dataSource:any;
  displayedColumns: string[] = ['name','standardName','divisionName','date','present','reason','action'];
  idSchoolDetail:number = 1;
  selectedValue=11;
  
  constructor(private router:Router,private studentInfoSerive:StudentInfoService,private dialog: MatDialog,
    private route:ActivatedRoute,private commonService:CommonService) {
    
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      idStandard:new FormControl(null, [Validators.required]),
      idDivision:new FormControl(null, [Validators.required]),
      idSubject:new FormControl(null, [Validators.required]),
    });
    this.studentInfoSerive.getStandard({idSchool:this.idSchoolDetail}).subscribe((res:any) =>{
      this.standardData = res.data;
      this.form.get('idStandard').setValue(this.standardData[0].idStandard);
      this.getDivisionData({value:this.form.get('idStandard').value})
        
    });
     } 
     onChangeStandard(idStandard){
      this.getDivisionData(idStandard);
     }

     getDivisionData(idStandard){
      this.studentInfoSerive.getDivision(idStandard,this.idSchoolDetail).subscribe((res:any) =>{
        this.divisionData = res.data;
        this.form.get('idDivision').setValue(this.divisionData[0].idDivision);
        this.getAllStudentData(this.form.get('idStandard').value,{value:this.form.get('idDivision').value})   
      });
     }
     onChangeDivision(idDivision){
      const idStandard = this.form.get('idStandard').value;
      this.getAllStudentData(idStandard,idDivision);
     }
     onChangeSubject(event){

     }

     getAllStudentData(idStandard,idDivision){
      this.studentInfoSerive.getAllStudent(idStandard,idDivision).subscribe((res:any) =>{
        this.studentData = res.data;
        this.dataSource = new MatTableDataSource(this.studentData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
       // this.dataSource = new MatTableDataSource(this.studentName);
      
        });
     }
 
     addHomework(){
    this.router.navigate(['./add-homework'],{relativeTo:this.route});
    }

    editHomeWork(studentName: any):void {
     console.log("Student Name",studentName);
      this.router.navigate(['./add-homework'],
      {
        queryParams:{"id":studentName.idStudent
          // "id":studentName.idStudent,'std':studentName.idStandard,'div':studentName.idDivision
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
      const dialogRef =  this.commonService.openDialog('Delete Confirmation','Are you sure that you want to delete Student Details?');
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
      
    back(){
      this.router.navigate(['../../dashboard'],{relativeTo:this.route});
    }

}
