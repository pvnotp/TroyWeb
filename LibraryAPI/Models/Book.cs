using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.Models
{
public class Book
{
    [Key]
    public Guid Id { get; set; }
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
    public string[]? Reviews { get; set; }
    public Guid? CheckedOutBy { get; set; }
    public DateTime DueDate { get; set; }

}
}
