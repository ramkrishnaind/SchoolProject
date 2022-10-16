import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentInfoService } from '../../services/student-info.service';
import * as XLSX from 'xlsx';
import { CommonService } from 'src/app/shared/common.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from '../../../service/authentication.service';

@Component({
  selector: 'app-data-upload',
  templateUrl: './data-upload.component.html',
  styleUrls: ['./data-upload.component.scss']
})
export class DataUploadComponent implements OnInit {


  @ViewChild('inputFile') inputFile: ElementRef;
  header:string='Bulk Upload';
  form: FormGroup;
  bulkUploadData;
  idSchool:number;
  isExcelFile:boolean =false;
fileAdded:string='fileblank';
  selectedFile:File;
  fileUpload:boolean=false;
loading:boolean=false;
dropDownSelected:string;
dropDownSelectedFormat:string;
excelDisable = true;
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,private fb: FormBuilder,private iconRegistry: MatIconRegistry,private sanitizer: DomSanitizer,private authservice:AuthenticationService ) {
      
      iconRegistry.addSvgIcon('excel', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/svgIcon/excel.svg'));
      this.idSchool = this.authservice.idSchool;
      this.bulkUploadData = this.getBulkUploadData();
    }

  ngOnInit(): void {
    this.form = this.fb.group({
      bulkUpload: new FormControl(null,[Validators.required]),
    });
  }

  onChangeBulkUpload(e){
    this.dropDownSelected = e.value;
    this.excelDisable = false;
    this.studentInfoSerive.getExcelDataFormat(this.dropDownSelected).subscribe((res:any) =>{
      this.dropDownSelectedFormat = res.data;
    });
  }
  
   clickToAddFile(){
    document.getElementById('file').click();
   }

  onFileChange(event) {
    this.isExcelFile = !!event.target.files[0].name.match(/(.xls|.xlsx)/);
    if (event.target.files.length > 1 || !this.isExcelFile) {
      this.inputFile.nativeElement.value = '';
      this.fileAdded = 'fileblank';
    }
    else{
      this.selectedFile = event.target.files[0];
      this.upload();
    }
  
  }

  upload(){
    if(this.isExcelFile){
      this.fileUpload = true;
      let workBook = null;
      let jsonData = null;
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary' });
        workBook.SheetNames.forEach(element => {
  
          jsonData = XLSX.utils.sheet_to_json(workBook.Sheets[element]);
          setTimeout(() =>{
            this.studentInfoSerive.bulkUpload(this.dropDownSelected,jsonData).subscribe((res:any) =>{
              if(res.error){
                this.fileAdded = 'fileerror';
                this.fileUpload = false;
                this.commonService.openSnackbar('Excel File Not Uploaded','Done');
              }
              else{
              this.fileAdded = 'fileupload';
              this.fileUpload = false;
              this.commonService.openSnackbar('Excel File Uploaded Successfully','Done');
              }
            });
          },5000);
           }); 
   }
      reader.readAsBinaryString(this.selectedFile);
  }
  }

  downloadFormat(){
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([this.dropDownSelectedFormat]);
    console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    var link = document.createElement("a");
    if (link.download !== undefined) {
      var url = URL.createObjectURL(data);
      link.setAttribute("href", url);
      link.setAttribute("download", `${this.dropDownSelected}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }


  getBulkUploadData(){
    return [
      // {
      //   id:'student',
      //   displayName:'Student'
      // },
      {
        id:'parent',
        displayName:'Parent'
      },
      {
        id:'result',
        displayName:'Result'
      },
      {
        id:'syllabus',
        displayName:'Syllabus'
      },
      {
        id:'timetable',
        displayName:'Time-table'
      },
      {
        id:'examtimeTable',
        displayName:'Exam TimeTable'
      },
      {
        id:'attendance',
        displayName:'Attendance'
      },
      // {
      //   id:'parent',
      //   displayName:'Parent'
      // },
      // {
      //   id:'parent',
      //   displayName:'Parent'
      // },
      // {
      //   id:'parent',
      //   displayName:'Parent'
      // },
      // {
      //   id:'parent',
      //   displayName:'Parent'
      // },
      // {
      //   id:'standard',
      //   displayName:'Standard'
      // },
      // {
      //   id:'division',
      //   displayName:'Division'
      // },
      // {
      //   id:'subject',
      //   displayName:'Subject'
      // },
      // {
      //   id:'teacher',
      //   displayName:'Teacher'
      // }
    ]
  }

}
