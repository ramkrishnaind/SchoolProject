import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../services/student-info.service';
import { CommonService } from 'src/app/shared/common.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AuthenticationService } from '../../service/authentication.service';
import { division, standard } from '../models/commonmodel';

class divisionExtended extends division{
  edit:boolean;
}

@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.scss']
})
export class DivisionComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  form: FormGroup;
  displayedColumns: string[] = ['name','action'];
  standardData: standard[];
  divisionData:divisionExtended[];
  dataSource:any;
  idStandardForDataView:number;
  idSchool:number;
  changeInDivisionValue:string;
  selectedStandard:number;
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,private authservice:AuthenticationService) {
    this.idSchool = this.authservice.idSchool;
   }


  ngOnInit(): void {
    this.form = new FormGroup({
      name:new FormControl(null, [Validators.required]),
      idStandard:new FormControl(null,[Validators.required])
      });
      this.studentInfoSerive.getStandard({idSchool:this.idSchool}).subscribe((res:any) =>{
        this.standardData = res.data;
        // this.form.get('idStandard').setValue(this.standardData[0].idStandard);
        this.selectedStandard = this.standardData[0].idStandard;
        this.getDivisionData({value:this.selectedStandard})
        this.idStandardForDataView = this.selectedStandard;
      });
  }
  onChangeStandard(idStandard){
    this.idStandardForDataView = idStandard.value
    this.getDivisionData(idStandard);
  }

  getDivisionData(idStandard){
    this.studentInfoSerive.getDivision(idStandard,this.idSchool).subscribe( (res:any) =>{
      this.divisionData = res.data
      this.divisionData.forEach((data)=>{
        data.edit = false;
      })
      this.dataSource = new MatTableDataSource(this.divisionData);
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

  changeDivision(event){
    this.changeInDivisionValue = event.target.value
  }

  onUpdate(e){
    e.edit = false;
   const body ={
      "idDivision":e.idDivision,
      "idStandard": e.idStandard,
      "name": this.changeInDivisionValue,
      "idSchoolDetails": e.idSchoolDetails
   }
   this.studentInfoSerive.division(body).subscribe(res =>{
    e.name = this.changeInDivisionValue;
    this.commonService.openSnackbar('Division Updated Successfully','Done');
  });

  }

  onDelete(data){
    const dialogRef =  this.commonService.openDialog('Delete Confirmation','Are you sure that you want to delete Division?');
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const body ={
          "idDivision":data.idDivision,
          "idStandard": data.idStandard,
          "name": data.name,
          "idSchoolDetails": data.idSchoolDetails
       }
       this.studentInfoSerive.delete('division',body).subscribe((res:any) =>{
        if(!res.error){
          const index = this.dataSource.data.findIndex(data => data.idDivision === res.data.idDivision);
          if( index != -1){
            this.dataSource.data.splice(index, 1);
            this.paginator.length = this.dataSource.data.length;
            this.dataSource.paginator = this.paginator
            this.table.renderRows();
          }
          this.commonService.openSnackbar('Division Deleted Successfully','Done');
      }
      });
      }
    });
   
  
  }

  

  makeBody(){
    const body ={
      name:this.form.get('name').value,
      idStandard:this.form.get('idStandard').value,
      "idSchoolDetails":this.idSchool
     };
    return body;
  }
  addDivision(){
    if(this.form.valid){
      const body = this.makeBody();
      this.studentInfoSerive.division(body).subscribe((res:any) =>{
        if(this.idStandardForDataView === res.idStandard){
          this.dataSource.data.push(res);
          this.paginator.length = this.dataSource.data.length;
          this.dataSource.paginator = this.paginator
          this.table.renderRows();

        }
        this.commonService.openSnackbar('Division Submitted Successfully','Done');
      });
    }
    else{
      this.commonService.openSnackbar('Please Fill All Field','Warning');
    }
  }

}
