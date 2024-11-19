
using System.Reflection.Emit;
using Bogus;
using LibraryAPI.Models;
using LibraryAPI.SeedConfiguration;

using Microsoft.EntityFrameworkCore;

namespace LibraryAPI.Data
{
    public class BookDbContext : DbContext
    {
        public required DbSet<Book> Books { get; set; }

        public BookDbContext() : base()
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            var stock = new Faker<Book>()
                .RuleFor(b => b.Title, f => f.Lorem.Sentence(2, 8))
                .RuleFor(b => b.Author, f => f.Person.FullName)
                .RuleFor(b => b.Description, f => f.Lorem.Sentence(10, 30))
                .RuleFor(b => b.CoverImage, f => f.Image.LoremFlickrUrl())
                .RuleFor(b => b.UserRating, f => new Random().Next(1, 6))
                .RuleFor(b => b.Publisher, f => f.Company.CompanyName())
                .RuleFor(b => b.PublicationDate, f => f.Date.Past(100, DateTime.Now))
                .RuleFor(b => b.Category, f => GetRandomBookCategory())
                .RuleFor(b => b.ISBN, f => GetRandomISBN())
                .RuleFor(b => b.PageCount, f => new Random().Next(1000));

            // generate 1000 items
            var modelBuilder = new ModelBuilder();

            modelBuilder.Entity<Book>()
                .HasData(stock.GenerateBetween(1000, 1000));
        }

        private string GetRandomBookCategory()
        {
            var categories = new List<string>()
            {
                "Mystery",
                "Young Adult",
                "Children's",
                "Science Fiction",
                "Fantasy",
                "Thriller",
                "Historical",
                "Biography",
                "Romance",
                "Graphic Novel",
                "Boring"
            };

            Random random = new Random();
            var randomIndex = random.Next(categories.Count);
            return categories[randomIndex];
        }

        private string GetRandomISBN()
        {
            Random random = new Random();
            //We need a 13 digit number, but that would be a long, not an int, so Random can't generate it for us.
            //Instead we get a number string 6 digits long and a number string 7 digits long and concatentate them.
            return random.Next(0, 1000000).ToString("D6") + random.Next(0, 10000000).ToString("D7");
        }
    }
}
