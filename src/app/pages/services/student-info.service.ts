import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Subject } from 'rxjs/Subject';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable({
  providedIn: 'root'
})
export class StudentInfoService {

  baseurl: string;
  FOLDER = "s3://mytestschool/pics/";
  private uploadingData = new Subject<any>();
     
    constructor( private http: HttpClient) { 
      this.baseurl = environment.baseURL;//'http://13.235.11.4/'
    }
  
    uploadFile(file) {
     const bucket = new S3(
            {
                accessKeyId:'AKIAT2CQFJV4LOTQCGV5',
                secretAccessKey:'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',
                region:'ap-south-1'
            }
        );
        const params = {
            Bucket:'mytestschool',
            Key: this.FOLDER + file.name,
            Body: file,
            ACL:'public-read'   
        };
        var that = this;
        bucket.upload(params, function (err, data) {
            // var imageLocation = data;
            var imageLocation = { message: "", data: "",status:'' };
            if (err) {
                // console.log('There was an error uploading your file: ', err);
                imageLocation.message = "There was an error uploading your file";
                imageLocation.data = "";
                imageLocation.status='error';
                that.uploadingData.next(imageLocation);
                return false;
            }
            imageLocation.message = "Successfully uploaded file.";
            imageLocation.data = data;
            imageLocation.status='success';
            that.uploadingData.next(imageLocation);
            return true;
        });

  }

  public getFile(){
    return this.uploadingData.asObservable();
  }
  getStandard(opt:{idSchool:number}){
    return this.http.get(`${this.baseurl}standard/?idSchool= ${opt.idSchool}`);
  }

  getDivision(idStandard,idSchool?:number){
    const urlParams = new HttpParams().set('idStandard',idStandard.value).set('idSchool',idSchool.toString());
    return this.http.get(`${this.baseurl}division/byStandard`, { params: urlParams });
   }
   studentInformation(body){
   return this.http.post(`${this.baseurl}student`,body);
   }
   getAllStudent(idStandard,idDivision){
    const urlParams = new HttpParams().set('idStandard',idStandard).set('idDivision',idDivision.value);
    return this.http.get(`${this.baseurl}student/getbyStdAndDiv`, { params: urlParams });
   }
  

   attendanceInformation(body){
     return this.http.post(`${this.baseurl}Attendance/ByNameBulk`,body);
   }
   homeworkDetails(body){
     return this.http.post(`${this.baseurl}homework`,body);
   }
   uploadHomeWorkFile(file:File){
    // http://13.235.11.4/homework/upload?file
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseurl}homework/upload?file`,formData);
   }
   hoidayDetails(body){
    return this.http.post(`${this.baseurl}hollyday`,body);
   }
   parentDetails(){
     return this.http.get(`${this.baseurl}parent`);
   }
   getAllSubject(idStandard,idSchool?:number){
    const urlParams = new HttpParams().set('idStandard',idStandard).set('idSchool',idSchool.toString());;
     return this.http.get(`${this.baseurl}subject/`, { params: urlParams })
   }
   getAllTeacher(){
     return this.http.get(`${this.baseurl}teacher/getall`);
   }
   getTestType(opt:{idSchool:number}){
     return this.http.get(`${this.baseurl}testtype?idSchool= ${opt.idSchool}`);
   }
   syllabus(body){
     return this.http.post(`${this.baseurl}syllabus`,body);
   }
   examTimetable(body){
     return this.http.post(`${this.baseurl}examtimetable`,body);
   }
   result(body){
    return this.http.post(`${this.baseurl}result`,body);
  }
  timetable(body){
    return this.http.post(`${this.baseurl}timetable`,body);
  }
  timetableBulkUpload(body){
    return this.http.post(`${this.baseurl}timetable/ByNameBulk`,body);
  }
   standard(body){
  return this.http.post(`${this.baseurl}/standard`,body);
   }
   deleteStandard(body){
    // return this.http.delete(`${this.baseurl}standard`,body);
    const url = this.baseurl + 'standard';
    return this.http.request('delete', url, { body: body });
   }
   division(body){
    return this.http.post(`${this.baseurl}division`,body);
   }
   subject(body){
    return this.http.post(`${this.baseurl}subject/ByNameBulk`,body);
   }
   getFeesType(){
     return this.http.get(`${this.baseurl}/feestype/`);
   }
   feesStucture(body){
     return this.http.post(`${this.baseurl}/feesstructure`,body);
   }
   getPaymentType(){
     return this.http.get(`${this.baseurl}PaymentType`);
   }

   feesDetails(body){
     return this.http.post(`${this.baseurl}PaymentType`,body);
   }

   saveTeacherData(body){
    return this.http.post(`${this.baseurl}teacher`,body);
  }
   teacherDetails(body){
    return this.http.post(`${this.baseurl}teacher/saveTeacherDetails`,body);
  }

  meetingDetails(body){
    return this.http.post(`${this.baseurl}meeting`,body);
  }
  getListOfBloodGroupData(){
    return this.http.get(`${this.baseurl}bloodgroup`);
  }
  getNationality(){
    return this.http.get(`${this.baseurl}nationality`);
  }
  getCountry(){
    return this.http.get(`${this.baseurl}country`);
  }
  getState(){
    return this.http.get(`${this.baseurl}state`);
  }
  getCity(){
    return this.http.get(`${this.baseurl}city`);
  }
  getNameBasedonDataAndId(data:any,id:number,searchProperty:string,getproperty:string){
    let name = '';
    data.forEach(ele => {
      if(ele[searchProperty] === id){
        name =ele[getproperty];
      }
    });
    return name;
    
   }
}
