import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../services/student-info.service';
import { CommonService } from 'src/app/shared/common.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  form: FormGroup;
  displayedColumns: string[] = ['name','action'];
  standardData: any;
  subjectData;
  dataSource:any;
  idStandardForSubjectView:number;
  idSchool:number=1
  changeInSubjectValue:string;
  selectedStandard;
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name:new FormControl(null, [Validators.required]),
      idStandard:new FormControl(null,[Validators.required])
      });

      this.studentInfoSerive.getStandard({idSchool:this.idSchool}).subscribe((res:any) =>{
        this.standardData = res.data;
        this.selectedStandard = this.standardData[0].idStandard;
        this.idStandardForSubjectView = this.selectedStandard;
        this.getAllSubjectData();
      });
      
  }
  onChangeSubject(idStandard){
    this.idStandardForSubjectView = idStandard.value
    this.getAllSubjectData();
  }

  getAllSubjectData(){
    this.studentInfoSerive.getAllSubject(this.idStandardForSubjectView,this.idSchool).subscribe( (res:any) =>{
      this.subjectData = res.data
      this.standardData.forEach((data)=>{
        data.edit = false;
      });
      this.dataSource = new MatTableDataSource(this.subjectData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onEdit(ele){
    ele.edit = true;
  }

  onCancel(data){
    data.edit = false;
  }

  changeSubject(event){
    this.changeInSubjectValue = event.target.value
    console.log(this.changeInSubjectValue);
  }

  onUpdate(e){
    e.edit = false;
   console.log(e);
   const body ={
      "idSubject": e.idSubject,
      "name": this.changeInSubjectValue,
      "idStandard": e.idStandard,
      "idSchoolDetails": e.idSchoolDetails
   }
   this.studentInfoSerive.updateSubject([body]).subscribe(res =>{
    e.name = this.changeInSubjectValue;
    this.commonService.openSnackbar('Subject Updated Successfully','Done');
  });

  }

  onDelete(data){
    console.log(data);
    const dialogRef =  this.commonService.openDialog('Delete Confirmation','Are you sure that you want to delete Subject?');
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const body ={
          ...data
       }
       this.studentInfoSerive.delete('subject/',body).subscribe((res:any) =>{
        if(!res.error){
          const index = this.dataSource.data.findIndex(data => data.idSubject === res.data.idSubject);
          if( index != -1){
            this.dataSource.data.splice(index, 1);
            this.paginator.length = this.dataSource.data.length;
            this.dataSource.paginator = this.paginator
            this.table.renderRows();
          }
          this.commonService.openSnackbar('Subject Deleted Successfully','Done');
      }
      });
      }
    });
   
  
  }

  makeBody(){
    const body =[{
      name:this.form.get('name').value,
      standard:this.studentInfoSerive.getNameBasedonDataAndId(this.standardData,this.form.get('idStandard').value,'idStandard','name'),
      schoolDetails:"SBPCOE"
     }];
    return body;
  }
  addSubject(){
    if(this.form.valid){
      const body = this.makeBody();
      this.studentInfoSerive.subject(body).subscribe((res:any) =>{
        if(this.idStandardForSubjectView === res.data.idStandard){
          this.dataSource.data.push(res);
          this.table.renderRows();
          this.paginator.length = this.dataSource.data.length;
          this.dataSource.paginator = this.paginator
          
        }
        this.form.reset()
        this.commonService.openSnackbar('Subject Submitted Successfully','Done');
      });
    }
    else{
      this.commonService.openSnackbar('Please Fill All Field','Warning');
    }
  }
}
