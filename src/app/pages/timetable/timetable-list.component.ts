import { Component,OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentInfoService } from '../services/student-info.service';
import {CommonService} from '../../shared/common.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-timetable-list',
  templateUrl: './timetable-list.component.html',
  styleUrls: ['./timetable-list.component.scss']
})
export class TimetableListComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  form: FormGroup;
  studentData;
  timeTableData;
  dateToDisplayInTable=[];
  standardData;
  divisionData;
  dataSource:any;
  displayedColumns: string[] = ['subjectName','weekDay','startTime','endTime','action'];
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
        this.getTimeTableList(this.form.get('idStandard').value,this.form.get('idDivision').value)   
      });
     }
     onChangeDivision(idDivision){
      const idStandard = this.form.get('idStandard').value;
      this.getTimeTableList(idStandard,idDivision.value);
     }

     getTimeTableList(idStandard,idDivision){
      this.studentInfoSerive.getListOfSchoolTimeTable(idStandard,idDivision).subscribe((res:any) =>{//need to Verify
        if(res.data.length){
        this.timeTableData = res.data;
        this.dateToDisplayInTable=[];
        this.timeTableData.forEach((data:any) => {
            this.dateToDisplayInTable.push({
              idTimetable:data.timetable.idTimetable,//idTimeTable
              subjectName:data.subject.name,
              weekDay:data.timetable.day,
              startTime:data.timetable.time.split('-')[0],
              endTime:data.timetable.time.split('-')[1],
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
 
     addTimeTable(){
    this.router.navigate(['./add-timetable'],{relativeTo:this.route});
    }

    editTimeTable(timeTableList: any):void {
     const editTimeTableData =this.getDataToUpdate(timeTableList.idTimetable);
      this.router.navigate(['./add-timetable'],
      {
        state:editTimeTableData,
         relativeTo :this.route
       }
       
       );
      
    }

    getDataToUpdate(idTimetable){
      let timeTableData;
        this.timeTableData.forEach(data => {
          if(data.timetable.idTimetable === idTimetable){
            timeTableData = data.timetable;
          }
        });
      
        return timeTableData;
    }

    onDelete(data){
      const timetableData =this.getDataToUpdate(data.idTimetable);
      const dialogRef =  this.commonService.openDialog('Delete Confirmation','Are you sure that you want to delete Timetable?');
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          const body ={ ...timetableData }
          this.studentInfoSerive.delete('timetable',body).subscribe((res:any) =>{
            if(res){
            const index = this.dataSource.data.findIndex(data => data.idTimetable === res.data.idTimetable);
            if( index != -1){
              this.dataSource.data.splice(index, 1);
              this.paginator.length = this.dataSource.data.length;
              this.dataSource.paginator = this.paginator
              this.table.renderRows();
            }
            this.commonService.openSnackbar('Timetable Data Deleted Successfully','Done');
          }
        });

        }
      });
    }
      
    back(){
      this.router.navigate(['../../dashboard'],{relativeTo:this.route});
    }

}
