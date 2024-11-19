namespace LibraryAPI.Models
{
    public class Book
    {
        public string Title { get; set; }
        public string Author { get; set; }
        public string Description { get; set; }
        public string CoverImage { get; set; }
        public int UserRating { get; set; }
        public string Publisher { get; set; }
        public DateTime PublicationDate { get; set; }
        public string Category { get; set; }
        public string ISBN {  get; set; }
        public int PageCount { get; set; }
        public string[] Reviews { get; set; }
        public string CheckedOutBy { get; set; }

    }
}
