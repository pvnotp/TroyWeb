import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(private http: HttpClient) { }
  baseURL = 'http://localhost:5274/api';

  getFeaturedBooks(): Observable<any[]> {
    return this.http.get<any[]>(this.baseURL + '/Book/getFeatured');
  }

}
