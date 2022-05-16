import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentInfoService } from '../student-info/student-info.service';
import {StudentInfoPopupComponent} from './../student-info-popup/student-info-popup.component'

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss']
})
export class StudentDetailsComponent implements AfterViewInit,OnInit {
  
  form: FormGroup;
  standredData: any;
  studentName;
  studentData;
  standredName;
  divisionData;
  divisionName;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['name','rollno','gender','age','dob','email','pmobileno','actions'];
  

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private route:Router,private studentInfoSerive:StudentInfoService,private dialog: MatDialog) {
    
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      idStandard:new FormControl(null, [Validators.required]),
      idDivision:new FormControl(null, [Validators.required]),
    });
    this.studentInfoSerive.getStandred().subscribe(res =>{
      this.standredData = res;
      this.standredName = this.standredData.data;
    });
     } 
     onChangeStandred(idStandard){
    
      this.studentInfoSerive.getDivision(idStandard).subscribe( res =>{
        this.divisionData = res;
        this.divisionName = this.divisionData.data;
       
      });
     }
     onChangeDivision(idStandard,idDivision){
      this.studentInfoSerive.getAllStudent(idStandard,idDivision).subscribe(res =>{
       this.studentData = res;
       this.studentName = this.studentData.data;
      this.dataSource = new MatTableDataSource(this.studentName);
     
       });
     }
 
  goStudentInfo(){
    this.route.navigate(['dashboard/student']);
    }
    editStudent(studentName: any):void {
     console.log("Student Name",studentName);
      this.route.navigate(['dashboard/StudentInfoPopup'],{
        queryParams:{"idStudent":studentName.idStudent,"name":studentName.name,"rollno":studentName.rollno,"dob":studentName.dob,
        "age":studentName.age,"bloodgrp":studentName.bloodgrp,"pmobileno":studentName.pmobileno,"smobileno":studentName.smobileno,
         "emergancyConntact":studentName.emergancyConntact,"email":studentName.email,"semail":studentName.semail,
          "subjects":studentName.subjects,"academicyear":studentName.academicyear,"address":studentName.address,"address2":studentName.address2,
         },
       });
      
         }
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }
    back(){
      this.route.navigate(['/dashboard']);
    }
}



