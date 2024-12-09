import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  baseURL = 'http://localhost:5274/api';

  setToken(token: any) {
    localStorage.setItem("token", token["accessToken"]);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  revokeToken() {
    return localStorage.removeItem("token");
  }

}
