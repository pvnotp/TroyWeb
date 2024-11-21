using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;
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

        [HttpGet("get")]
        public async Task<IActionResult> GetBook(Guid id)
        {
            var book = await _bookContext.FindAsync<Book>(id);
            return Ok(book);
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
            var bookMatches = books.Where(x => x.Title.Contains(searchTerm));
            return Ok(bookMatches);
        }

        [HttpPost("checkOut")]
        public async Task<IActionResult> CheckOutBook([FromBody] JsonObject checkoutData)
        {

            var bookId = checkoutData["bookId"].ToString();
            var book = await _bookContext.FindAsync<Book>(new Guid(bookId));
            if (book == null)
            {
                Console.WriteLine($"Book {bookId} was not found");
                return BadRequest();
            }
            _bookContext.Books.Update(book);

            var userId = checkoutData["userId"].ToString();
            book.CheckedOutBy = new Guid(userId);
            _bookContext.SaveChanges();
            
            return Ok(book);
        }

    }
}
