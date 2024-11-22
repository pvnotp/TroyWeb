export class Book {
  id: string;
  title: string;
  coverImage: string;
  author: string;
  rating: number;
  description: string;
  publisher: string;
  publicationDate: any;
  category: string;
  isbn: string;
  pageCount: number;
  reviews: string[]
  checkedOutBy: string;
  dueDate: Date;
  checkOutDisabled: boolean | undefined;

  constructor() {
    this.id = "";
    this.title = "";
    this.coverImage = "";
    this.author = "";
    this.rating = 0;
    this.description = "";
    this.publisher = "";
    this.publicationDate = new Date();
    this.category = "";
    this.isbn = "";
    this.pageCount = 0;
    this.reviews = []
    this.checkedOutBy = "";
    this.dueDate = new Date();
    this.checkOutDisabled = undefined;
  }

}
