import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DatePipe } from '@angular/common';
import { BookService } from '../shared/services/book.service';



/**
 * @title Table retrieving data through HTTP
 */
@Component({
  selector: 'featured-component',
  styleUrl: 'featured.component.css',
  templateUrl: 'featured.component.html',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule, DatePipe, MatFormFieldModule, MatInputModule],
})
export class FeaturedComponent implements AfterViewInit {
  private _httpClient = inject(HttpClient);

  displayedColumns: string[] = ['cover', 'title', 'author', 'description', 'rating', 'checkOut'];
  bookService: BookService = new BookService(this._httpClient);
  bookData: any;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  ngAfterViewInit() {


    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.bookService.getFeaturedBooks(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.

          return data;
        }),
      )
      .subscribe(data => (
        this.bookData = new MatTableDataSource(data)));

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.bookData.filter = filterValue.trim().toLowerCase();
  }

  
}

//export interface GithubApi {
//  items: GithubIssue[];
//  total_count: number;
//}

//export interface GithubIssue {
//  created_at: string;
//  number: string;
//  state: string;
//  title: string;
//}

///** An example database that the data source uses to retrieve data for the table. */
//export class ExampleHttpDatabase {
//  constructor(private _httpClient: HttpClient) { }

//  getRepoIssues(sort: string, order: SortDirection, page: number): Observable<GithubApi> {
//    const href = 'https://api.github.com/search/issues';
//    const requestUrl = `${href}?q=repo:angular/components&sort=${sort}&order=${order}&page=${page + 1
//      }`;

//    return this._httpClient.get<GithubApi>(requestUrl);
//  }
//}
