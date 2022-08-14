import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../services/student-info.service';
import { CommonService } from 'src/app/shared/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../service/authentication.service';


@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.scss']
})
export class AttendanceListComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  form: FormGroup;
  studentAttendanceList;
  dateToDisplayInTable=[];
  standardData;
  divisionData;
  minDate:Date;
  maxDate:Date;
  dataSource:any;
  displayedColumns: string[] = ['studentName','present','reason','action'];
  idSchoolDetail:number;
  
  constructor(private router:Router,private studentInfoSerive:StudentInfoService,private dialog: MatDialog,
    private route:ActivatedRoute,private commonService:CommonService,private authservice:AuthenticationService) {

      this.idSchoolDetail = this.authservice.idSchool;
      const currentYear = new Date().getFullYear();
      const m = new Date().getMonth();
      if(m==0 || m==1 || m==2){
        this.minDate = new Date(currentYear-1, 3, 1);
        this.maxDate = new Date(currentYear, 2, 31);
      }
      else{
        this.minDate = new Date(currentYear, 3, 1);
        this.maxDate = new Date(currentYear + 1, 2, 31);
      }
    
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      date: new FormControl(new Date(),[Validators.required]),
      idStandard:new FormControl(null, [Validators.required]),
      idDivision:new FormControl(null, [Validators.required]),
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
        this.getAllStudentAttendance(this.form.get('idStandard').value,this.form.get('idDivision').value,moment(this.form.get('date').value).format('YYYY/MM/DD'))   
      });
     }
     onChangeDivision(idDivision){
      const idStandard = this.form.get('idStandard').value;
      this.getAllStudentAttendance(idStandard,idDivision.value,moment(this.form.get('date').value).format('YYYY/MM/DD'));
     }

     getAllStudentAttendance(idStandard,idDivision,date){
      this.studentInfoSerive.getAllAttendance(idStandard,idDivision,date).subscribe((res:any) =>{
         if(res.data.length){
        this.studentAttendanceList = res.data;
        this.dateToDisplayInTable=[];
        this.studentAttendanceList.forEach((data:any) => {
            this.dateToDisplayInTable.push({
              idAttendance:data.attendance.idAttendance,//idAttendance
              studentName:data.student.name,
              present:data.attendance.present,
              reason:data.attendance.reasons,
            })
        });
        this.dataSource = new MatTableDataSource(this.dateToDisplayInTable);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else{
        this.dateToDisplayInTable=[];
        this.dataSource = new MatTableDataSource(this.dateToDisplayInTable);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
       // this.dataSource = new MatTableDataSource(this.studentName);
      
        });
     }

     dobClick(date){
      this.getAllStudentAttendance(this.form.get('idStandard').value,this.form.get('idDivision').value,moment(this.form.get('date').value).format('YYYY/MM/DD'));
    }
 
  addAttendance(){
    this.router.navigate(['./add-attendance'],{relativeTo:this.route});
    }

    editAttendance(studentAttendance: any):void {
     const studentAttendanceData =this.getDataToUpdate(studentAttendance.idAttendance);
      this.router.navigate(['./add-attendance'],
      {
        state:studentAttendanceData,
        //queryParams:{"id":studentName.idStudent
          // "id":studentName.idStudent,'std':studentName.idStandard,'div':studentName.idDivision
        // queryParams:{"idStudent":studentName.idStudent,"name":studentName.name,"rollno":studentName.rollno,"dob":studentName.dob,
        // "age":studentName.age,"bloodgrp":studentName.bloodgrp,"pmobileno":studentName.pmobileno,"smobileno":studentName.smobileno,
        //  "emergancyConntact":studentName.emergancyConntact,"email":studentName.email,"semail":studentName.semail,
        //   "subjects":studentName.subjects,"academicyear":studentName.academicyear,"address":studentName.address,
        //   "address2":studentName.address2,"idParent":studentName.idParent,"idStandard":studentName.idStandard,"idDivision":studentName.idDivision,
        //   "gender":studentName.gender,"idNationality":studentName.nationality
        //  },
      //},
         relativeTo :this.route
       }
       
       );
      
    }

    getDataToUpdate(idAttendance){
      let studentAttendance;
        this.studentAttendanceList.forEach(data => {
          if(data.attendance.idAttendance === idAttendance){
            studentAttendance = data;
          }
        });
      
        return studentAttendance;
    }

    onDelete(data){
      const dialogRef =  this.commonService.openDialog('Delete Confirmation','Are you sure that you want to remove Student Attendance?');
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          const body ={ ...data }
         this.studentInfoSerive.delete('Attendance',body).subscribe((res:any) =>{
         if(!res.error){
          const index = this.dataSource.data.findIndex(data => data.idAttendance === res.data.idAttendance);
          if( index != -1){
            this.dataSource.data.splice(index, 1);
            this.paginator.length = this.dataSource.data.length;
            this.dataSource.paginator = this.paginator
            this.table.renderRows();
          }
          this.commonService.openSnackbar('Attendance Deleted Successfully','Done');
        }
        });

        }
      });
    }
      
    back(){
      this.router.navigate(['../../dashboard'],{relativeTo:this.route});
    }
}
