import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, inject } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { of as observableOf, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { BookService } from '../shared/services/book.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../shared/services/user.service';
import { Book } from '../shared/models/Book';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

/**
 * @title Table retrieving data through HTTP
 */
@Component({
  selector: 'bookView-component',
  styleUrl: 'bookView.component.css',
  templateUrl: 'bookView.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTableModule, MatSortModule, DatePipe, MatFormFieldModule, MatInputModule, MatIconModule, TitleCasePipe, MatButtonModule],
})
export class BookViewComponent implements AfterViewInit {
  httpClient = inject(HttpClient);
  displayedColumns: string[] = ['cover', 'title', 'author', 'description', 'rating', 'availability', 'checkOut', 'edit'];
  bookService: BookService = new BookService(this.httpClient);
  bookData: MatTableDataSource<Book> = new MatTableDataSource<Book>();
  expandedElement: Book | null = null;
  searchInput = new Subject<string>();
  resultsLength = 0;
  userEmail: string = "";
  userRole: string = "";
  userId: string = "";

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  constructor(private userService: UserService, private router: Router) {

  }

  ngAfterViewInit() {
    this.userService.getUserRole()
      .subscribe(
        role => { this.userRole = role }
    );

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
    this.userService.getUserId().subscribe(user => this.userId = user);

    console.log(this.userEmail);
    
    console.log(this.userId);
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
    this.bookService.checkInBook({ "bookId": book.id }).subscribe(() => { console.log("Checked in book " + book.id) });

    book.checkedOutBy = "";
    book.checkOutDisabled == false; 
  }

  checkOutBook(book: Book) {
    const checkOutData = {
      "userId": this.userId,
      "bookId": book.id
    }
    this.bookService.checkoutBook(checkOutData).subscribe(() => { console.log("Checked out book " + book.id) });

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
        return "Due on " + new Date(book.dueDate).toDateString();
      }
    }
      
  }

  checkOutDisabled(book: Book) {
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

  showLibrarianButton() {
    return this.userRole == "Librarian";
  }

  setEditBook(book: Book) {
    this.router.navigate(["/editor", {book: JSON.stringify(book)}]);
  }

  addBook() {
    this.router.navigate(["/editor", { book: JSON.stringify(new Book())}]);
  }
 
}




