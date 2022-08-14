import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../services/student-info.service';
import { CommonService } from 'src/app/shared/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../service/authentication.service';

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
  homeworkData;
  dateToDisplayInTable=[];
  standardData;
  divisionData;
  subjectData;
  dataSource:any;
  displayedColumns: string[] = ['teacherName','homeworkName','description','assignDate','dueDate','action'];
  idSchoolDetail:number;
  
  constructor(private router:Router,private studentInfoSerive:StudentInfoService,private dialog: MatDialog,
    private route:ActivatedRoute,private commonService:CommonService,private authservice:AuthenticationService) {
    this.idSchoolDetail = this.authservice.idSchool;
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
      // this.getAllSubjectData(idStandard.value);
     }

     getDivisionData(idStandard){
      this.studentInfoSerive.getDivision(idStandard,this.idSchoolDetail).subscribe((res:any) =>{
        this.divisionData = res.data;
        this.form.get('idDivision').setValue(this.divisionData[0].idDivision);
        this.getAllSubjectData(this.form.get('idStandard').value)
        // this.getListOfHomeWork(this.form.get('idStandard').value,{value:this.form.get('idDivision').value})   
      });
     }

     onChangeDivision(idDivision){
      const idStandard = this.form.get('idStandard').value;
      this.getListOfHomeWork(idStandard,this.form.get('idDivision').value,this.form.get('idSubject').value);
     }

     getAllSubjectData(idStandard){
      this.studentInfoSerive.getAllSubject(idStandard,this.idSchoolDetail).subscribe( (res:any) =>{
        this.subjectData = res.data
        this.form.get('idSubject').setValue(this.subjectData[0].idSubject);
        this.getListOfHomeWork(this.form.get('idStandard').value,this.form.get('idDivision').value,this.form.get('idSubject').value) 
      });
    }

     onChangeSubject(idSubject){
      // this.getAllStudentData(idStandard,idDivision);
      this.getListOfHomeWork(this.form.get('idStandard').value,this.form.get('idDivision').value,this.form.get('idSubject').value) 
     }

     getListOfHomeWork(idStandard,idDivision,idSubject){
      this.studentInfoSerive.getListOfHomeWork(idStandard,idDivision,idSubject).subscribe((res:any) =>{
        if(res.data.length){
        this.homeworkData = res.data;
        this.dateToDisplayInTable=[];
        this.homeworkData.forEach((data:any) => {
            this.dateToDisplayInTable.push({
              idHomework:data.homework.idHomework,
              teacherName:data.teacher.name,
              homeworkName:data.homework.homeworkName,
              description:data.homework.description,
              assignDate:data.homework.assigndate,
              dueDate:data.homework.duedate,
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
 
     addHomework(){
    this.router.navigate(['./add-homework'],{relativeTo:this.route});
    }

    editHomeWork(homework: any):void {
     const homeworkData =this.getDataToUpdate(homework.idHomework);
      this.router.navigate(['./add-homework'],
      {
        state:homeworkData,
        //queryParams:{"id":homework.idHomework
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

    getDataToUpdate(idHomework){
      let homework;
        this.homeworkData.forEach(data => {
          if(data.homework.idHomework === idHomework){
            homework = data.homework;
          }
        });
      
        return homework;
    }

    onDelete(data){
      const homeworkData =this.getDataToUpdate(data.idHomework);
      const dialogRef =  this.commonService.openDialog('Delete Confirmation','Are you sure that you want to remove Homework Data?');
      dialogRef.afterClosed().subscribe(result => {
        if(result){
           const body ={ ...homeworkData }
          this.studentInfoSerive.delete('homework',body).subscribe((res:any) =>{
            this.homeworkData = this.homeworkData.filter((data)=> data.homework.idHomework != res.data.idHomework)
            const index = this.dataSource.data.findIndex(data => data.idHomework === res.data.idHomework);
            if( index != -1){
              this.dataSource.data.splice(index, 1);
              this.paginator.length = this.dataSource.data.length;
              this.dataSource.paginator = this.paginator
              this.table.renderRows();
            }
            this.commonService.openSnackbar('Homework Data Deleted Successfully','Done');
         });

        }
      });
    }


      
    back(){
      this.router.navigate(['../../dashboard'],{relativeTo:this.route});
    }

}
