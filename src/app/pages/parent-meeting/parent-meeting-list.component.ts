import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/shared/common.service';
import { StudentInfoService } from '../services/student-info.service';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-parent-meeting-list',
  templateUrl: './parent-meeting-list.component.html',
  styleUrls: ['./parent-meeting-list.component.scss']
})
export class ParentMeetingListComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  form: FormGroup;
  parentMeetingListData;
  dateToDisplayInTable=[];
  studentData;
  standardData;
  divisionData;
  dataSource:any;
  displayedColumns: string[] = ['date','teacherName','meetingTopics','meetingDetails','startTime','endTime','slotTime','action'];
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
        this.getAllParentMeetingList(this.form.get('idStandard').value,{value:this.form.get('idDivision').value})   
      });
     }
     onChangeDivision(idDivision){
      const idStandard = this.form.get('idStandard').value;
      this.getAllParentMeetingList(idStandard,idDivision);
     }

     getAllParentMeetingList(idStandard,idDivision){
      this.studentInfoSerive.getExamTimeTable(idStandard,idDivision).subscribe((res:any) =>{
        this.parentMeetingListData = res.data;
        this.parentMeetingListData.forEach((data:any) => {
            this.dateToDisplayInTable.push({//need to verify
              idUnitTest:data.examTimetable.idUnitTest,//idParentMeetingList
              date:data.examTimetable.date,
              teacherName:data.subject.name,
              meetingTopics:data.testType.name,
              meetingDetails:data.testType.name,
              startTime:data.examTimetable.time.split('-')[0],
              endTime:data.examTimetable.time.split('-')[1],
              slotTime:data.testType.name,
            })
        });
        this.dataSource = new MatTableDataSource(this.dateToDisplayInTable);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
       // this.dataSource = new MatTableDataSource(this.studentName);
        });
     }
 
     addParentMeeting(){
    this.router.navigate(['./add-parent-meet'],{relativeTo:this.route});
    }

    editParentMeeting(parentMeeting: any):void {
     console.log("Student Name",parentMeeting);
     const parentMeetingData=this.getDataToUpdate(parentMeeting.idMeeting);
      this.router.navigate(['./add-parent-meet'],
      {
        state:parentMeetingData,
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

    getDataToUpdate(meetingId){//need to verify
      let parentMeetingData;
        this.parentMeetingListData.forEach(data => {
          if(data.examTimetable.idUnitTest === meetingId){
            parentMeetingData = data.examTimetable;
          }
        });
      
        return parentMeetingData;
    }

    onDelete(data){
      const dialogRef =  this.commonService.openDialog('Delete Confirmation','Are you sure that you want to delete Parent Meeting Schedule?');
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          const parentMeetingData =this.getDataToUpdate(data.meetingId);//need to Verify
          const body ={ ...parentMeetingData }
         this.studentInfoSerive.delete('meeting',body).subscribe((res:any) =>{
           const index = this.dataSource.data.findIndex(data => data.idSubject === res.idDivision);
           if( index != -1){
             this.dataSource.data.splice(index, 1);
             this.paginator.length = this.dataSource.data.length;
             this.dataSource.paginator = this.paginator
             this.table.renderRows();
            }
            this.commonService.openSnackbar('Parent Meeting Deleted Successfully','Done');
        });

        }
      });
    }
      
    back(){
      this.router.navigate(['../../dashboard'],{relativeTo:this.route});
    }

}
