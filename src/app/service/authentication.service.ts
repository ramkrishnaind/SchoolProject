import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  baseurl = environment.baseURL;//'http://13.235.11.4/'
  idSchool:number;

  constructor(private http: HttpClient) {
      this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
      if(this.currentUserValue){
        this.idSchool = this.currentUserSubject.value.idSchool;
     }
  }

  public get currentUserValue(): any {
      return this.currentUserSubject.value;
  }

  login(username, password) {
      return this.http.get<any>(`${this.baseurl}/login/log?username=${username}&password=${password}`, )
          .pipe(map(res => {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('currentUser', JSON.stringify(res.data[0].user));
              this.currentUserSubject.next(res.data[0].user);
              return res.data[0].user;
          }));
  }

  logout() {
      // remove user from local storage and set current user to null
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
  }
}
