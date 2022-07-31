import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../services/student-info.service';
import { CommonService } from 'src/app/shared/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-examtimetable',
  templateUrl: './examtimetable.component.html',
  styleUrls: ['./examtimetable.component.scss']
})
export class ExamtimetableComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  form: FormGroup;
  examTimeTableData;
  dateToDisplayInTable=[];
  standardData;
  divisionData;
  dataSource:any;
  displayedColumns: string[] = ['subjectName','testType','examDate','startTime','endTime','action'];
  idSchoolDetail:number = 1;
  selectedValue=11;
  
  constructor(private router:Router,private studentInfoSerive:StudentInfoService,private dialog: MatDialog,
    private route:ActivatedRoute,private commonService:CommonService) {
    
  }
  ngOnInit(): void {
    this.form = new FormGroup({
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
        this.getListOfExamTimeTable(this.form.get('idStandard').value,this.form.get('idDivision').value);
        // this.getAllStudentData(this.form.get('idStandard').value,{value:this.form.get('idDivision').value})   
      });
     }
     onChangeDivision(idDivision){
      const idStandard = this.form.get('idStandard').value;
      // this.getAllStudentData(idStandard,idDivision);
      this.getListOfExamTimeTable(idStandard,this.form.get('idDivision').value);
     }

     getListOfExamTimeTable(idStandard,idDivision){
      this.studentInfoSerive.getExamTimeTable(idStandard,idDivision).subscribe((res:any) =>{
        if(res.data.length){
        this.examTimeTableData = res.data;
        this.dateToDisplayInTable=[];
        this.examTimeTableData.forEach((data:any) => {
            this.dateToDisplayInTable.push({
              idUnitTest:data.examTimetable.idUnitTest,//idExamTimeTable
              subjectName:data.subject.name,
              testType:data.testType.name,
              examDate:data.examTimetable.date,
              startTime:data.examTimetable.time.split('-')[0],
              endTime:data.examTimetable.time.split('-')[1],
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
        });
     }

    //  getAllStudentData(idStandard,idDivision){
    //   this.studentInfoSerive.getAllStudent(idStandard,idDivision).subscribe((res:any) =>{
    //     this.studentData = res.data;
    //     this.dataSource = new MatTableDataSource(this.studentData);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //    // this.dataSource = new MatTableDataSource(this.studentName);
      
    //     });
    //  }
 
     addExamTimeTable(){
    this.router.navigate(['./add-examtimetable'],{relativeTo:this.route});
    }

    editExamTimetable(examTimeTable: any):void {
     const examTimeTableData =this.getDataToUpdate(examTimeTable.idUnitTest);
      this.router.navigate(['./add-examtimetable'],
      {
        state:examTimeTableData,
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

    getDataToUpdate(idExamTimeTable){
      let examTimeTable;
        this.examTimeTableData.forEach(data => {
          if(data.examTimetable.idUnitTest === idExamTimeTable){
            examTimeTable = data.examTimetable;
          }
        });
      
        return examTimeTable;
    }

    onDelete(data){
      const dialogRef =  this.commonService.openDialog('Delete Confirmation','Are you sure that you want to delete ExamTimeTable Details?');
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          const body ={...data}
         this.studentInfoSerive.delete('examtimetable',body).subscribe((res:any) =>{
           const index = this.dataSource.data.findIndex(data => data.idUnitTest === res.idUnitTest);
           if( index != -1){
             this.dataSource.data.splice(index, 1);
             this.paginator.length = this.dataSource.data.length;
             this.dataSource.paginator = this.paginator
             this.table.renderRows();
            }
            this.commonService.openSnackbar('ExamTimeTable Data Deleted Successfully','Done');
          });

        }
      });
    }
      
    back(){
      this.router.navigate(['../../dashboard'],{relativeTo:this.route});
    }

}
