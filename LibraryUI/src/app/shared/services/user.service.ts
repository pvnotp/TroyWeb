import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }
  baseURL = 'http://localhost:5274/api';

  createUser(userData: any) {
    return this.http.post(this.baseURL + '/User/signup', userData);
  }

  getUser(userName: string) {
    const params = new HttpParams().set("userName", userName);
    return this.http.get(this.baseURL + '/User/signin', { params });
  }

}
