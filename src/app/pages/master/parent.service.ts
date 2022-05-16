import { EventEmitter, Injectable, Output } from '@angular/core';
import {environment} from './../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Subject } from 'rxjs/Subject';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
@Injectable({
  providedIn: 'root'
})
export class ParentService {
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
      
    
//for upload progress   
/*bucket.upload(params).on('httpUploadProgress', function (evt) {
          console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
      }).send(function (err, data) {
          if (err) {
              console.log('There was an error uploading your file: ', err);
              return false;
          }
          console.log('Successfully uploaded file.', data);
          return true;
      });*/
}
parentDetails(body){
return this.http.post(`${this.baseurl}parent`,body)
}
}
