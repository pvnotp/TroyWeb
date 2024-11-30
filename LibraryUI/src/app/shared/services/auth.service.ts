import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  baseURL = 'http://localhost:5274/api';

  login() {
    return true;
  }

  logout() {
    return false;
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem("loggedIn") === "true"
  }

  getRole(userEmail: string) {
    const params = new HttpParams().set("userEmail", userEmail);
    return this.http.get(this.baseURL + '/User/getRole', { params });
  }

}
