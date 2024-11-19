using LibraryAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LibraryAPI.SeedConfiguration
{
    public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole>
    {
        public void Configure(EntityTypeBuilder<IdentityRole> builder)
        {
            builder.HasData(
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
