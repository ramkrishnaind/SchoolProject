import { EventEmitter, Injectable, Output } from '@angular/core';
import {environment} from './../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Subject } from 'rxjs/Subject';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable({
  providedIn: 'root'
})
export class StudentInfoService {

  baseurl: string;
  FOLDER = "s3://mytestschool/pics/"
     
    constructor( private http: HttpClient) { 
      this.baseurl = environment.baseURL;
    }
  
    uploadFile(file) {
     const bucket = new S3(
            {
                accessKeyId:'AKIAT2CQFJV4O5RUH3ID',
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
        bucket.upload(params, function (err, data) {
            var imageLocation = data;
            if (err) {
                console.log('There was an error uploading your file: ', err);
                return false;
            }
           
            console.log('Successfully uploaded file.', data);
             
            return true;
        });

  }
  getStandred(){
    return this.http.get(`${this.baseurl}standard/`);
  }

  getDivision(idStandard){
    const urlParams = new HttpParams().set('idStandard',idStandard.value);
    return this.http.get(`${this.baseurl}division/byStandard`, { params: urlParams });
   }
   studentInformation(body){
   return this.http.post(`${this.baseurl}student`,body);
   }
   getAllStudent(idStandard,idDivision){
    const urlParams = new HttpParams().set('idStandard',idStandard.value).set('idDivision',idDivision.value);
    return this.http.get(`${this.baseurl}student/getbyStdAndDiv`, { params: urlParams });
   }
  

   attendanceInformation(body){
     return this.http.post(`${this.baseurl}Attendance/`,body);
   }
   homeworkDetails(body){
     return this.http.post(`${this.baseurl}homework`,body);
   }
   hoidayDetails(body){
    return this.http.post(`${this.baseurl}hollyday`,body);
   }
   parentDetails(){
     return this.http.get(`${this.baseurl}parent`);
   }
   getAllSubject(idStandard){
    const urlParams = new HttpParams().set('idStandard',idStandard.value);
     return this.http.get(`${this.baseurl}subject/`, { params: urlParams })
   }
   getAllTechare(){
     return this.http.get(`${this.baseurl}teacher/getall`);
   }
   getTestType(){
     return this.http.get(`${this.baseurl}testtype`);
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
   standred(body){
  return this.http.post(`${this.baseurl}/standard`,body);
   }
   division(body){
    return this.http.post(`${this.baseurl}/division`,body);
   }
   subject(body){
    return this.http.post(`${this.baseurl}/subject/`,body);
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

   teacherDetails(body){
    return this.http.post(`${this.baseurl}teacher/saveTeacherDetails`,body);
  }

  meetingDetails(body){
    return this.http.post(`${this.baseurl}meeting`,body);
  }
}
