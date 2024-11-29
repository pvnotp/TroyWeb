import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user = new BehaviorSubject("");
  role = new BehaviorSubject("");
  baseURL = 'http://localhost:5274/';
  constructor(private http: HttpClient) { }


  createUser(userData: any) {
    return this.http.post(this.baseURL + 'register', userData);
  }

  setRole(userData: any) {
    return this.http.post(this.baseURL + "api/User/setRole", userData);
  }

  loginUser(userData: any) {
    return this.http.post(this.baseURL + 'login', userData);
  }

  fetchUserId(userName: string) {
    const params = new HttpParams().set("userName", userName);
    return this.http.get(this.baseURL + 'api/User/getUser', { params, responseType: "text" });
  }

  setUserId(user: any) {
    this.user.next(user);
  }

  getUserId() {
    return this.user.asObservable();
  }

  setUserRole(role: string) {
    this.role.next(role);
  }

  getUserRole() {
    return this.role.asObservable();
  }

}
