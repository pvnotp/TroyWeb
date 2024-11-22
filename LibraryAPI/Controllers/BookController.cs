using System.Text.Json.Nodes;
using LibraryAPI.Data;
using LibraryAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {

        private readonly BookDbContext _bookContext;

        public BookController(BookDbContext context)
        {
            _bookContext = context;
        }


        [HttpGet("getFeatured")]
        public async Task<IActionResult> GetFeaturedBooks()
        {
            var books = await _bookContext.Books.ToListAsync();
            var featuredBooks = new List<Book>();
            var random = new Random();
            for (var i = 0; i < 10; i++)
            {
                featuredBooks.Add(books[random.Next(0, books.Count)]);
            }
            return Ok(featuredBooks);
        }

        [HttpGet("getMatching")]
        public async Task<IActionResult> GetBooksBySearchTerm(string searchTerm)
        {
            var books = await _bookContext.Books.ToListAsync();
            var bookMatches = books.Where(x => x.Title.IndexOf(searchTerm, StringComparison.OrdinalIgnoreCase) >= 0);
            return Ok(bookMatches);
        }

        [HttpPost("checkOut")]
        public async Task<IActionResult> CheckOutBook([FromBody] JsonObject checkoutData)
        {

            var bookId = checkoutData["bookId"]?.ToString();
            if (bookId == null)
            {
                return BadRequest($"No book id was provided.");
            }
            var book = await _bookContext.FindAsync<Book>(new Guid(bookId));
            if (book == null)
            {
                return BadRequest($"Book {bookId} was not found");
            }
            _bookContext.Books.Update(book);

            var userId = checkoutData["userId"]?.ToString();
            if(userId == null)
            {
                return BadRequest($"User {userId} was not found");
            }
            book.CheckedOutBy = new Guid(userId);
            book.DueDate = DateTime.Now.AddDays(5);
            await _bookContext.SaveChangesAsync();
            
            return Ok(book);
        }


        [HttpPost("checkIn")]
        public async Task<IActionResult> CheckInBook([FromBody] JsonObject checkInData)
        {

            var bookId = checkInData["bookId"]?.ToString();
            if(bookId == null)
            {
                return BadRequest($"No book id was provided.");
            }
            var book = await _bookContext.FindAsync<Book>(new Guid(bookId));
            if (book == null)
            {
                return BadRequest($"Book {bookId} was not found");
            }
            _bookContext.Books.Update(book);

            book.CheckedOutBy = null;
            book.DueDate = new DateTime();
            await _bookContext.SaveChangesAsync();

            return Ok(book);
        }


        [HttpPost("add")]
        public async Task<IActionResult> AddBook([FromBody] JsonObject bookData)
        {
            var newBook = new Book();
            newBook = setBookValues(newBook, bookData);
            newBook.Id = new Guid();
            await _bookContext.AddAsync(newBook);
            await _bookContext.SaveChangesAsync();
            return Ok(newBook);
        }


        [HttpPut("update")]
        public async Task<IActionResult> UpdateBook([FromBody] JsonObject updatedBook)
        {
            var bookId = updatedBook["id"]?.ToString();
            if (bookId == null)
            {
                return BadRequest($"No book id was provided.");
            }
            var book = await _bookContext.FindAsync<Book>(new Guid(bookId));
            if (book == null)
            {
                return BadRequest($"Book {bookId} was not found");
            }


            _bookContext.Books.Update(book);

            book = setBookValues(book, updatedBook);

            await _bookContext.SaveChangesAsync();

            return Ok(book);
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteBook(string bookId)
        {
            if (bookId == null)
            {
                return BadRequest($"No book id was provided.");
            }
            var book = await _bookContext.FindAsync<Book>(new Guid(bookId));
            if (book == null)
            {
                return BadRequest($"Book {bookId} was not found");
            }

            _bookContext.Books.Remove(book);
            await _bookContext.SaveChangesAsync();

            return Ok();
        }


        private Book setBookValues(Book book, JsonObject bookValues)
        {
            book.Title = bookValues["title"]?.ToString() ?? book.Title;
            book.Author = bookValues["author"]?.ToString() ?? book.Author;
            book.Description = bookValues["description"]?.ToString() ?? book.Description;
            book.CoverImage = bookValues["coverImage"]?.ToString() ?? book.CoverImage;
            book.Publisher = bookValues["publisher"]?.ToString() ?? book.Publisher;
            book.PublicationDate = bookValues["publicationDate"] == null ? book.PublicationDate : DateTime.Parse(bookValues["publicationDate"].ToString());
            book.Category = bookValues["category"]?.ToString() ?? book.Category;
            book.ISBN = bookValues["isbn"]?.ToString() ?? book.ISBN;
            book.PageCount = bookValues["pageCount"]?.ToString() == null ? book.PageCount : int.Parse(bookValues["pageCount"]?.ToString());

            return book;
        }
    }
}
