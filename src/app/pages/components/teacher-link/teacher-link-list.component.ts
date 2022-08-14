import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../../services/student-info.service';
import { CommonService } from 'src/app/shared/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../../service/authentication.service';


@Component({
  selector: 'app-teacher-link-list',
  templateUrl: './teacher-link-list.component.html',
  styleUrls: ['./teacher-link-list.component.scss']
})
export class TeacherLinkListComponent implements OnInit {

 
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  form: FormGroup;
  teacherDetailData
  dateToDisplayInTable=[];
  studentData;
  standardData;
  divisionData;
  dataSource:any;
  displayedColumns: string[] = ['name','subjectName','action'];
  idSchoolDetail;
  
  constructor(private router:Router,private studentInfoSerive:StudentInfoService,private dialog: MatDialog,
    private route:ActivatedRoute,private commonService:CommonService,private authservice:AuthenticationService) {
      this.idSchoolDetail = this.authservice.idSchool;
    
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
        this.getListOfTeacherDetails(this.form.get('idStandard').value,this.form.get('idDivision').value)   
      });
     }
     onChangeDivision(idDivision){
      const idStandard = this.form.get('idStandard').value;
      this.getListOfTeacherDetails(idStandard,idDivision.value);
     }

     getListOfTeacherDetails(idStandard,idDivision){
      this.studentInfoSerive.getTeacherDetails(idStandard,idDivision).subscribe((res:any) =>{
        if(res.data.length){
        this.teacherDetailData = res.data;
        this.dateToDisplayInTable=[];
        this.teacherDetailData.forEach((data:any) => {
            this.dateToDisplayInTable.push({
              idteacherDetail:data.teacherdetails.idteacherDetail,//idteacherDetail
              name:data.teacher.name,
              subjectName:data.subject.name,
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
 
     addTeacherLink(){
    this.router.navigate(['../add-teacher-link'],{relativeTo:this.route});
    }

    editTeacherLink(teacherList: any):void {
     const teacherDetailData =this.getDataToUpdate(teacherList.idteacherDetail);
      this.router.navigate(['../add-teacher-link'],
      {
        state:teacherDetailData,
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

    getDataToUpdate(idteacherDetail){
      let teacherDetail;
        this.teacherDetailData.forEach(data => {
          if(data.teacherdetails.idteacherDetail === idteacherDetail){
            teacherDetail = data.teacherdetails;
          }
        });
      
        return teacherDetail;
    }


    onDelete(data){
      const dialogRef =  this.commonService.openDialog('Delete Confirmation','Are you sure that you want to delete Teacher Link?');
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          const teacherDetailData =this.getDataToUpdate(data.idteacherDetail);
          const body ={ ...teacherDetailData }
         this.studentInfoSerive.delete('teacher/saveTeacherDetails',body).subscribe((res:any) =>{
           const index = this.dataSource.data.findIndex(data => data.idteacherDetail === res.idteacherDetail);//need to verify
           if( index != -1){
             this.dataSource.data.splice(index, 1);
             this.paginator.length = this.dataSource.data.length;
             this.dataSource.paginator = this.paginator
             this.table.renderRows();
            }
            this.commonService.openSnackbar('Teacher Successfully Remove from class','Done');
        });

        }
      });
    }
      
    back(){
      this.router.navigate(['../dashboard'],{relativeTo:this.route});
    }

}
