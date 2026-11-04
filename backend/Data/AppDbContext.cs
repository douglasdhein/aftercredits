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

    public DbSet<Review> Reviews { get; set; }

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

        modelBuilder.Entity<Review>(entity =>
        {
            entity.Property(review => review.MediaType)
                .HasMaxLength(20);

            entity.Property(review => review.Rating)
                .HasPrecision(2, 1);

            entity.Property(review => review.Content)
                .HasMaxLength(2000);

            entity.HasOne(review => review.User)
                .WithMany(user => user.Reviews)
                .HasForeignKey(review => review.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(review => new
            {
                review.UserId,
                review.MediaId,
                review.MediaType
            })
                .IsUnique();
        });
    }
}