import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userId = new BehaviorSubject("");
  baseURL = 'http://localhost:5274/api';
  constructor(private http: HttpClient) { }


  createUser(userData: any) {
    return this.http.post(this.baseURL + '/User/signup', userData);
  }

  getUser(userName: string) {
    const params = new HttpParams().set("userName", userName);
    return this.http.get(this.baseURL + '/User/signin', { params });
  }

  setUserId(userId: string) {
    this.userId.next(userId);
  }

  getUserId() {
    return this.userId.asObservable();
  }

}
