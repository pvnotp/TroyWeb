import { Component } from '@angular/core';
import { BookService } from '../shared/services/book.service';
import { MatGridListModule } from '@angular/material/grid-list'

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [MatGridListModule],
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.css'
})

export class FeaturedComponent {

  books: any[] = [];
  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.bookService.getFeaturedBooks()
      .subscribe((result) =>
      {
        this.books = result;
      });
  }
}
