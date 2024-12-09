import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../models/Book'

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(private http: HttpClient) { }
  baseURL = 'http://localhost:5274/api';
  editBook = new BehaviorSubject(new Book());

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

  updateBook(bookData: Book) {
    return this.http.put(this.baseURL + '/Book/update', bookData);
  }

  deleteBook(bookId: string) {
    const params = new HttpParams().set("bookId", bookId);
    return this.http.delete(this.baseURL + '/Book/delete', { params });
  }

  addBook(bookData: Book) {
    return this.http.post(this.baseURL + '/Book/add', bookData);
  }
 
}
