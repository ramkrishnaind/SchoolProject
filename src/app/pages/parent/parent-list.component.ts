import { Component,OnInit, ViewChild } from '@angular/core';
import {CommonService} from '../../shared/common.service';
import { StudentInfoService } from '../services/student-info.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthenticationService } from '../../service/authentication.service';
import { parent } from '../models/commonmodel';
import { AddParentDetailComponent } from './add-parent-detail/add-parent-detail.component';
@Component({
  selector: 'app-parent-list',
  templateUrl: './parent-list.component.html',
  styleUrls: ['./parent-list.component.scss']
})
export class ParentListComponent implements OnInit {
  
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
 parentData:parent[]=[];
  dataSource:any;
  displayedColumns: string[] = ['name','address1','address2' ,'gender','pemail','pmobile_no','smobileno','action'];
  idSchoolDetail:number;
  
  constructor(private router:Router,private studentInfoSerive:StudentInfoService,private dialog: MatDialog,
    private route:ActivatedRoute,private commonService:CommonService,private authservice:AuthenticationService) {
    this.idSchoolDetail = this.authservice.idSchool;
  }
  ngOnInit(): void {
    this.getParentData();
  } 
     
  getParentData(){
    this.studentInfoSerive.parentDetails().subscribe((res:parent[]) =>{
      this.parentData = res;
      this.dataSource = new MatTableDataSource(this.parentData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
     });
  }

    editParent(parentData: any):void {
      this.router.navigate(['./add-parent'],
      {
        queryParams:{"idParent":parentData.idparent
        // queryParams:{"idStudent":studentName.idStudent,"name":studentName.name,"rollno":studentName.rollno,"dob":studentName.dob,
        // "age":studentName.age,"bloodgrp":studentName.bloodgrp,"pmobileno":studentName.pmobileno,"smobileno":studentName.smobileno,
        //  "emergancyConntact":studentName.emergancyConntact,"email":studentName.email,"semail":studentName.semail,
        //   "subjects":studentName.subjects,"academicyear":studentName.academicyear,"address":studentName.address,
        //   "address2":studentName.address2,"idParent":studentName.idParent,"idStandard":studentName.idStandard,"idDivision":studentName.idDivision,
        //   "gender":studentName.gender,"idNationality":studentName.nationality
        //  },
      },
         relativeTo :this.route
       }
       
       );
      
    }

    onDelete(data){
      const dialogRef =  this.commonService.openDialog('Delete Confirmation','Are you sure that you want to delete Parent Details?');
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          const body ={ ...data }
         this.studentInfoSerive.delete('parent',body).subscribe((res:any) =>{
          this.commonService.openSnackbar('Parent Data Deleted Successfully','Done');
          const index = this.dataSource.data.findIndex(data => data.idSubject === res.idDivision);
          if( index != -1){
            this.dataSource.data.splice(index, 1);
            this.paginator.length = this.dataSource.data.length;
            this.dataSource.paginator = this.paginator
            this.table.renderRows();
          }
        });

        }
      });

    }
    addParent(){
      this.router.navigate(['add-parent'],{relativeTo:this.route});
    }
}
