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
  displayedColumns: string[] = ['cover', 'title', 'author', 'description', 'rating', 'availability', 'checkOut'];
  bookService: BookService = new BookService(this._httpClient);

  bookData: MatTableDataSource<Book> = new MatTableDataSource<Book>();
  expandedElement: Book | null = null;
  searchInput = new Subject<string>();
  resultsLength = 0;
  userId: string = "";
  userRole: string = "";

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  constructor(private userService: UserService) {
    this.userService.getUserId().subscribe(id => this.userId = id);
  }

  ngAfterViewInit() {

    this.bookService.getFeaturedBooks()
      .subscribe(
        data => {
          this.bookData = new MatTableDataSource(data);
          this.bookData.sort = this.sort;
        });

    this.searchInput.pipe(
      debounceTime(300)
    ).subscribe((searchTerm: string) => {
      this.bookService.getMatchingBooks(searchTerm)
        .subscribe(
          data => {
            this.bookData = new MatTableDataSource(data);
            this.bookData.sort = this.sort;
          });
    });
  }


  updateSearch(event: Event) {
    this.searchInput.next((event.target as HTMLInputElement).value);
   }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.bookData.filter = filterValue.trim().toLowerCase();
  }

  checkBook(book: Book) {
    this.userService.getUserId()
      .subscribe(
        id => { this.userId = id }
      );

    this.userService.getUserRole()
      .subscribe(
        role => { this.userRole = role }
    );

    if (book.checkedOutBy && this.userRole == "Librarian") {
      this.checkInBook(book);
    } else {
      this.checkOutBook(book);
    }
  }

  checkInBook(book: Book) {
    this.bookService.checkInBook({ "bookId": book.id }).subscribe(() => { });

    book.checkedOutBy = "";
    book.checkOutDisabled == false; 
  }

  checkOutBook(book: Book) {
    const userData = {
      "userId": this.userId,
      "bookId": book.id
    }
    this.bookService.checkoutBook(userData).subscribe(() => { });

    book.checkedOutBy = this.userId;
    if (this.userRole != "Librarian") {
      book.checkOutDisabled == true;
    }

  }

  displayAvailability(book: Book) {
    if (!book.checkedOutBy) {
      return "Available";
    } else {

      if (book.dueDate.toString() == "0001-01-01T00:00:00") {
        //book has just been checked out but due date hasn't been loaded from the database yet.
        var dueDate = new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000);
        return "Due on " + dueDate.toDateString();
      } else {
        return "Due on " + book.dueDate;
      }
      
    }
  }

  checkOutDisabled(book: Book) {
    console.log(this.userRole);
    if (this.userRole == "Librarian") {
      return false;
    } else {
      return book.checkedOutBy ? true : book.checkOutDisabled;
    }
  }

  getBookCheckButtonLabel(book: Book) {
    if (this.userRole == "Librarian" && book.checkedOutBy) {
      return "Check In";
    } else {
      return "Check Out";
    }
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
  checkedOutBy: string;
  dueDate: Date;
  checkOutDisabled: boolean | undefined;
}


