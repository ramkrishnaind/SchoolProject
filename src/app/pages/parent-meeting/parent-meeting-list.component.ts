import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/shared/common.service';
import { StudentInfoService } from '../services/student-info.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../service/authentication.service';
import { division, standard } from '../models/commonmodel';


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
  standardData:standard;
  divisionData:division;
  dataSource:any;
  displayedColumns: string[] = ['date','teacherName','meetingTopics','meetingDetails','startTime','endTime','slotTime','action'];
  idSchoolDetail:number;
  // minDate:Date;
  // maxDate:Date;
  
  constructor(private router:Router,private studentInfoSerive:StudentInfoService,private dialog: MatDialog,
    private route:ActivatedRoute,private commonService:CommonService,private authservice:AuthenticationService) {
      this.idSchoolDetail = this.authservice.idSchool;
      // const currentYear = new Date().getFullYear();
      // const m = new Date().getMonth();
      // if(m==0 || m==1 || m==2){
      //   this.minDate = new Date(currentYear-1, 3, 1);
      //   this.maxDate = new Date(currentYear, 2, 31);
      // }
      // else{
      //   this.minDate = new Date(currentYear, 3, 1);
      //   this.maxDate = new Date(currentYear + 1, 2, 31);
      // }
    
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      // date: new FormControl(new Date(),[Validators.required]),
      idStandard:new FormControl(null, [Validators.required]),
      idDivision:new FormControl(null, [Validators.required]),
    });

    // this.getAllParentMeetingList(moment(this.form.get('date').value).format('YYYY/MM/DD'));

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
      this.studentInfoSerive.getListOfParentMeet(idStandard,idDivision.value).subscribe((res:any) =>{
        if(res.data){
        this.parentMeetingListData = res.data;
        this.parentMeetingListData.forEach((data:any) => {
            this.dateToDisplayInTable.push({//need to verify
              idMeeting:data.meeting.idMeeting,//idParentMeetingList
              date:data.meeting.date,
              teacherName:data.teacher.name,
              // standardName:data.subject.name,
              // divisionName:data.subject.name,
              meetingTopics:data.meeting.meetingTopics,
              meetingDetails:data.meeting.meetingDescription,
              startTime:data.meeting.startTime,
              endTime:data.meeting.endTime,
              slotTime:data.meeting.slotTime,
            })
        });
        this.dataSource = new MatTableDataSource(this.dateToDisplayInTable);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
       // this.dataSource = new MatTableDataSource(this.studentName);
        });
     }

    //  dobClick(date){
    //   this.getAllParentMeetingList(moment(this.form.get('date').value).format('YYYY/MM/DD'));
    // }
 
     addParentMeeting(){
    this.router.navigate(['./add-parent-meet'],{relativeTo:this.route});
    }

    editParentMeeting(parentMeeting: any):void {
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
          if(data.meeting.idMeeting === meetingId){
            parentMeetingData = data.meeting;
          }
        });
      
        return parentMeetingData;
    }

    onDelete(data){
      const dialogRef =  this.commonService.openDialog('Delete Confirmation','Are you sure that you want to delete Parent Meeting Schedule?');
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          const parentMeetingData =this.getDataToUpdate(data.idMeeting);
          const body ={ ...parentMeetingData }
         this.studentInfoSerive.delete('meeting',body).subscribe((res:any) =>{
           const index = this.dataSource.data.findIndex(data => data.idMeeting === res.data.idMeeting);
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
