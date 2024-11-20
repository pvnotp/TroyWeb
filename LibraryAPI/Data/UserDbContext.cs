using Bogus.DataSets;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LibraryAPI.Data
{
    public class UserDbContext : IdentityDbContext<IdentityUser, IdentityRole, string>
    {
        public required DbSet<IdentityUser> IdentityUsers { get; set; }

        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options){}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.HasDefaultSchema("User");
            builder.Entity<IdentityRole>()
                .HasData(
                    new IdentityRole
                    {
                        Id = "382c74c3-721d-4f34-80e5-57657b6cbc27",
                        Name = "Customer",
                        NormalizedName = "CUSTOMER",
                    },
                    new IdentityRole
                    {
                        Id = "6B29FC40-CA47-1067-B31D-00DD010662DA",
                        Name = "Librarian",
                        NormalizedName = "LIBRARIAN",
                    }
                );
        }

 

    }
}
