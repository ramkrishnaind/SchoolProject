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
  selector: 'app-examresult',
  templateUrl: './examresult.component.html',
  styleUrls: ['./examresult.component.scss']
})
export class ExamresultComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  form: FormGroup;
  examResultData;
  dateToDisplayInTable=[];
  standardData;
  divisionData;
  dataSource:any;
  displayedColumns: string[] = ['studentName','subjectName','testType','maxMark','minMark','obtain','remark','action'];
  idSchoolDetail:number;
  
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
        this.getListOfExamResult(this.form.get('idStandard').value,this.form.get('idDivision').value)   
      });
     }
     onChangeDivision(idDivision){
      const idStandard = this.form.get('idStandard').value;
      this.getListOfExamResult(idStandard,idDivision.value);
     }

     getListOfExamResult(idStandard,idDivision){
      this.studentInfoSerive.getListOfExamResult(idStandard,idDivision).subscribe((res:any) =>{
        if(res.data.length){
        this.examResultData = res.data;
        this.dateToDisplayInTable=[];
        this.examResultData.forEach((data:any) => {
            this.dateToDisplayInTable.push({
              idResult:data.result.idResult,//idResult
              studentName:data.student.name,
              subjectName:data.subject.name,
              testType:data.testtype.name,
              maxMark:data.result.max,
              minMark:data.result.min,
              obtain:data.result.obtain,
              remark:data.result.remark,
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
 
     addExamResult(){
    this.router.navigate(['./add-result'],{relativeTo:this.route});
    }

    editResult(examResult: any):void {
     const examResultData =this.getDataToUpdate(examResult.idResult);
      this.router.navigate(['./add-result'],{ state:examResultData, relativeTo :this.route});
      
    }


    onDelete(data){
      const dialogRef =  this.commonService.openDialog('Delete Confirmation','Are you sure that you want to delete Exam Result?');
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          const examResultData =this.getDataToUpdate(data.idResult);
          const body ={  ...examResultData }
         this.studentInfoSerive.delete('result',body).subscribe((res:any) =>{
           const index = this.dataSource.data.findIndex(data => data.idResult === res.data.idResult);
           if( index != -1){
             this.dataSource.data.splice(index, 1);
             this.paginator.length = this.dataSource.data.length;
             this.dataSource.paginator = this.paginator
             this.table.renderRows();
            }
          this.commonService.openSnackbar('Exam Result Data Deleted Successfully','Done');
        });

        }
      });
    }

    getDataToUpdate(idExamResult){//needToverify
      let examResultData;
        this.examResultData.forEach(data => {
          if(data.result.idResult === idExamResult){
            examResultData = data.result;
          }
        });
      
        return examResultData;
    }
      
    back(){
      this.router.navigate(['../../dashboard'],{relativeTo:this.route});
    }

}
