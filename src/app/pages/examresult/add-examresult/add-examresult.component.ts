import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentInfoService } from '../../services/student-info.service';
import {CommonService} from '../../../shared/common.service';
import * as XLSX from 'xlsx';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-examresult',
  templateUrl: './add-examresult.component.html',
  styleUrls: ['./add-examresult.component.scss']
})
export class AddExamresultComponent implements OnInit {

  
  @ViewChild('inputFile') inputFile: ElementRef;
  
  form: FormGroup;
  editExamResultData
  standardData;
  divisionData;
  subjectData;
  testTypeData;
  studentData;
  idSchool:number=1;
  attributeData=
  {
    idStandard:'idStandard',
    idDivision:'idDivision',
    idSubject:'idSubject',
    idtestType:'idtestType',
    idStudent:'idStudent',
    obtain:'obtain',
    min:'min',
    max:'max',
    remark:'remark'
}
fileAdded:string='fileblank';
  selectedFile:File;
  fileUpload:boolean=false;
  loading:boolean=false;
  constructor(private studentInfoSerive:StudentInfoService,private commonService:CommonService,private router:Router,
    private route :ActivatedRoute,private iconRegistry: MatIconRegistry,private sanitizer: DomSanitizer ) { 
      iconRegistry.addSvgIcon('excel', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/svgIcon/excel.svg'));
      if(this.router.getCurrentNavigation().extras.state != undefined){
        this.editExamResultData =this.router.getCurrentNavigation().extras.state;
      }
    }
 

  ngOnInit(): void {
    this.form = new FormGroup({
      idStandard:new FormControl(null,[Validators.required]),
      idDivision:new FormControl(null,[Validators.required]),
      idSubject:new FormControl(null,[Validators.required]),
      idtestType:new FormControl(null,[Validators.required]),
      idStudent:new FormControl(null,[Validators.required]),
      obtain:new FormControl(null,[Validators.required,Validators.pattern("^[0-9]*$")]),
      min:new FormControl(null,[Validators.required,Validators.pattern("^[0-9]*$")]),
      max:new FormControl(null,[Validators.required,Validators.pattern("^[0-9]*$")]),
      remark:new FormControl(null,[Validators.required]),
    });
    this.getAllStandardData();
    this.getTestType();
  }
  getAllStandardData(){
    this.studentInfoSerive.getStandard({idSchool:this.idSchool}).subscribe((res:any) =>{
      this.standardData = res.data;
      if(this.editExamResultData){
        this.getDivisionData({value:this.editExamResultData.idStandard},'update');
        this.getAllSubjectData({value:this.editExamResultData.idStandard});
      }
    });
  }

  getTestType(){
    this.studentInfoSerive.getTestType({idSchool:this.idSchool}).subscribe((res:any) =>{
      this.testTypeData = res.data;
    });
  }
  onChangeStandard(idStandard){
    this.getDivisionData(idStandard,'normal');
    this.getAllSubjectData(idStandard);
   }

   getDivisionData(idStandard,callFor){
    this.studentInfoSerive.getDivision(idStandard,this.idSchool).subscribe((res:any) =>{
      this.divisionData = res.data;
      this.getAllStudent(this.editExamResultData.idStandard,{value:this.editExamResultData.idDivision},callFor)
    });
   }
   onChangeDivision(idDivision){
    const idStandardValue = this.form.get('idStandard').value;
    this.getAllStudent(idStandardValue,{value:this.form.get('idDivision').value},'normal')
   }

   getAllStudent(idStandard,idDivision,callFor){
    this.studentInfoSerive.getAllStudent(idStandard,idDivision).subscribe((res:any) =>{
      this.studentData = res.data;
      if(callFor === 'update'){
        this.updateValue();
      }
     });

   }

   updateValue(){
     this.form.get('idStandard').setValue(this.editExamResultData.idStandard);
     this.form.get('idDivision').setValue(this.editExamResultData.idDivision);
     this.form.get('idSubject').setValue(this.editExamResultData.idSubject);
     this.form.get('idtestType').setValue(this.editExamResultData.idtestType);
     this.form.get('idStudent').setValue(this.editExamResultData.idStudent);
     this.form.get('obtain').setValue(this.editExamResultData.obtain);
     this.form.get('min').setValue(this.editExamResultData.min);
     this.form.get('max').setValue(this.editExamResultData.max);
     this.form.get('remark').setValue(this.editExamResultData.remark);
     // this.teacherImageDataUploadToS3 = this.editExamResultData.profileurl;
     // this.form.get('parentName').setValue(this.parentData.name);
   }



   getAllSubjectData(idStandard){
    this.studentInfoSerive.getAllSubject(idStandard.value,this.idSchool).subscribe((res:any) =>{
      this.subjectData = res.data;
     })
   }

   setLimitBasedOnMaxValue(event){
    this.form.get('min').setValidators([Validators.max(event)]);
    this.form.get('obtain').setValidators([Validators.max(event)]);
   }
   makeBody(){
    const body =[{
      idStandard:this.form.get('idStandard').value,
      idDivision:this.form.get('idDivision').value,
      idSubject:this.form.get('idSubject').value,
      idtestType:this.form.get('idtestType').value,
      idStudent:this.form.get('idStudent').value,
      obtain:this.form.get('obtain').value,
      min:this.form.get('min').value,
      max:this.form.get('max').value,
      remark:this.form.get('remark').value,
      idSchoolDetails:this.idSchool
}];

if(this.editExamResultData){
  body[0]['idResult'] = this.editExamResultData.idResult;
 }

return body;
   }

   buttonSecond(){
    this.submit();
   }

   submit(){
    const data = this.checkDataForUpdate();
     if(data.valid){
      this.loading = true;
    const body = this.makeBody();
    this.studentInfoSerive.result(body).subscribe(res =>{
      if(res){
        this.loading = false;
        if(this.editExamResultData){
          this.commonService.openSnackbar('Result Updated Successfully','Done');
          this.back();
        }
        else{
          this.commonService.openSnackbar('Result Added Successfully','Done');
          this.form.reset();
        }
      }
     
    });
  }
  else{
    this.commonService.openSnackbar(data.msg,'Warning');
  }
   
  }

  checkDataForUpdate(){
    if(this.editExamResultData){
      return {msg:'Please,Make changes to Update' ,valid:this.form.valid && this.checkChangeInValueForUpdate()}
    }
    else{
      return {msg:'Please Fill All Field', valid:this.form.valid }
    }
   }

   checkChangeInValueForUpdate(){
    let flag = false;
    const keys = Object.keys(this.attributeData)
    
  
    for (const key in this.attributeData) {
      if(this.editExamResultData[key] != this.form.get(this.attributeData[key]).value){
        flag = true;
        break;
      }
    };

    return flag;
   }

   
   
   

   clickToAddFile(){
    document.getElementById('file').click();
   }


   onFileChange(event) {
    const isExcelFile = !!event.target.files[0].name.match(/(.xls|.xlsx)/);
    if (event.target.files.length > 1 || !isExcelFile) {
      this.inputFile.nativeElement.value = '';
      this.fileAdded = 'fileblank';
    }
    else{
      this.selectedFile = event.target.files[0];
      this.upload();
      console.log(this.selectedFile);
    }
  
  }

  upload(){
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
            this.studentInfoSerive.result(jsonData).subscribe(res =>{
              if(res){
              this.fileAdded = 'fileupload';
              this.fileUpload = false;
              this.commonService.openSnackbar('Excel Result Uploaded Successfully','Done');
              }
            });
          },5000);
           }); 
   }
      reader.readAsBinaryString(this.selectedFile);
  }

  downloadFormat(){

  }

  back(){
    // this.route.navigate(['/dashboard']);
    this.router.navigate(['../../examResult'],{relativeTo:this.route});
  }
}
