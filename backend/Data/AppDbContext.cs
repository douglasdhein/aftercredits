using AfterCredits.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace AfterCredits.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(user => user.Name)
                .HasMaxLength(100);

            entity.Property(user => user.Email)
                .HasMaxLength(255);

            entity.Property(user => user.PasswordHash)
                .HasMaxLength(255);

            entity.HasIndex(user => user.Email)
                .IsUnique();
        });
    }
}