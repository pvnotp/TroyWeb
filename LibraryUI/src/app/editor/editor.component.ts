import { Component, ViewChild, AfterViewInit, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { BookService } from '../shared/services/book.service';
import { Book } from '../shared/models/Book'
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { DatePipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [MatGridListModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, DatePipe, FormsModule, MatButtonModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent {
  httpClient = inject(HttpClient);
  bookService: BookService = new BookService(this.httpClient);
  prevBook: Book = new Book();
  updatedBook: Book = new Book();
  readonly date = new FormControl(new Date());

  constructor(private actRoute: ActivatedRoute) { }

  ngOnInit() {
    var jsonString = this.actRoute.snapshot.paramMap.get('book');
    if (jsonString) {
      this.prevBook = JSON.parse(jsonString);
      this.updatedBook = this.prevBook;
    }
  }

  addBook() {
    this.bookService.addBook(this.updatedBook).subscribe((res) => { console.log(res); });
  }

  updateBook() {
    this.bookService.updateBook(this.updatedBook).subscribe((res) => { console.log(res); });
  }

  deleteBook() {
    this.bookService.deleteBook(this.updatedBook.id).subscribe((res) => { console.log(res); });
    this.updatedBook = new Book();
    this.prevBook = new Book();
  }
}
