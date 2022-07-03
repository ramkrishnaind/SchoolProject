import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentInfoService } from '../services/student-info.service';
import {StudentInfoPopupComponent} from './student-info-popup/student-info-popup.component'
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss']
})
export class StudentDetailsComponent implements AfterViewInit,OnInit {

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  form: FormGroup;
  studentData;
  standardData;
  divisionData;
  dataSource:any;
  displayedColumns: string[] = ['name','rollno','gender','age','dob','email','pmobileno','actions'];
  idSchoolDetail:number = 1;
  selectedValue=11;
  
  constructor(private router:Router,private studentInfoSerive:StudentInfoService,private dialog: MatDialog,
    private route:ActivatedRoute) {
    
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      idStandard:new FormControl(null, [Validators.required]),
      idDivision:new FormControl(null, [Validators.required]),
    });
    this.studentInfoSerive.getStandred({idSchool:this.idSchoolDetail}).subscribe((res:any) =>{
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

     getAllStudentData(idStandard,idDivision){
      this.studentInfoSerive.getAllStudent(idStandard,idDivision).subscribe((res:any) =>{
        this.studentData = res.data;
        this.dataSource = new MatTableDataSource(this.studentData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
       // this.dataSource = new MatTableDataSource(this.studentName);
      
        });
     }
 
  goStudentInfo(){
    this.router.navigate(['./student'],{relativeTo:this.route});
    }

    editStudent(studentName: any):void {
     console.log("Student Name",studentName);
      this.router.navigate(['./StudentInfoPopup'],
      {
        queryParams:{...studentName
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
      
    ngAfterViewInit() {
      // this.dataSource.paginator = this.paginator;
    }
    back(){
      this.router.navigate(['../../dashboard'],{relativeTo:this.route});
    }
}



