import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { merge, Observable, of as observableOf, Subject } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { BookService } from '../shared/services/book.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../shared/services/user.service';

/**
 * @title Table retrieving data through HTTP
 */
@Component({
  selector: 'featured-component',
  styleUrl: 'featured.component.css',
  templateUrl: 'featured.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule, DatePipe, MatFormFieldModule, MatInputModule, MatIconModule, TitleCasePipe],
})
export class FeaturedComponent implements AfterViewInit {
  _httpClient = inject(HttpClient);
  displayedColumns: string[] = ['cover', 'title', 'author', 'description', 'rating', 'checkOut'];
  bookService: BookService = new BookService(this._httpClient);

  bookData: MatTableDataSource<Book> = new MatTableDataSource<Book>();
  displayedBooks: MatTableDataSource<Book> = new MatTableDataSource<Book>();
  expandedElement: Book | null = null;
  searchInput = new Subject<string>();
  resultsLength = 0;
  userId: string = "";

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  constructor(private userService: UserService) {
    this.userService.getUserId().subscribe(id => this.userId = id);
  }

  ngAfterViewInit() {
    this.displayedBooks.sort = this.sort;

    this.bookService.getFeaturedBooks(this.sort.active, this.sort.direction)
      .subscribe(
        data => this.bookData = new MatTableDataSource(data));

    this.searchInput.pipe(
      debounceTime(300)
    ).subscribe((searchTerm: string) => {
      this.bookService.getMatchingBooks(this.sort.active, this.sort.direction, searchTerm)
        .subscribe(
          data => this.bookData = new MatTableDataSource(data));
    });
  }

  updateSearch(event: Event) {
    this.searchInput.next((event.target as HTMLInputElement).value);
   }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.bookData.filter = filterValue.trim().toLowerCase();
  }

  checkOutBook(bookId: string) {

    this.userService.getUserId()
      .subscribe(
        id => { this.userId = id }
    )
    const userData = {
      "userId": this.userId,
      "bookId": bookId
    }
    this.bookService.checkoutBook(userData)
      .subscribe({
        next: (res: any) => {
        }
      });
  }
 
}

export interface Book {
  id: string;
  title: string;
  coverImage: number;
  author: number;
  rating: string;
  description: string;
  publisher: string;
  publicationDate: any;
  category: string;
  ISBN: string;
  pageCount: number;
  reviews: string[]
}


