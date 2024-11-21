import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sort, SortDirection } from '@angular/material/sort';
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

  getMatchingBooks(searchTerm: string): Observable<any[]> {
    const params = new HttpParams().set("searchTerm", searchTerm);
    return this.http.get<any[]>(this.baseURL + '/Book/getMatching', { params });
  }

  checkoutBook(checkOutData: any) {
    return this.http.post(this.baseURL + '/Book/checkOut', checkOutData);
  }

  checkInBook(checkInData: any) {
    return this.http.post(this.baseURL + '/Book/checkIn', checkInData);
  }

}
