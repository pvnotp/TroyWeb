import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;

  constructor(private http: HttpClient) { }
  baseURL = 'http://localhost:5274/api';

  login() {
    this.loggedIn = true;
  }

  logout() {
    this.loggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.loggedIn;
  }

  getRole(userName: string) {
    const params = new HttpParams().set("userName", userName);
    return this.http.get(this.baseURL + '/User/role', { params });
  }
}
