import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Subject } from 'rxjs/Subject';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
@Injectable({
  providedIn: 'root'
})
export class ParentService {
baseurl: string;
FOLDER = "s3://mytestschool/pics/";
private uploadingData = new Subject<any>();
   
  constructor( private http: HttpClient) { 
    this.baseurl = environment.baseURL;
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
        //   var imageLocation = data;
        var imageLocation = { message: "", data: "",status:'' };
          if (err) {
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
public getFile(){
    return this.uploadingData.asObservable();
  }
parentDetails(body){
return this.http.post(`${this.baseurl}parent`,body)
}
}
