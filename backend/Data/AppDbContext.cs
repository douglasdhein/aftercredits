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

    public DbSet<ReviewLike> ReviewLikes { get; set; }

    public DbSet<ReviewComment> ReviewComments { get; set; }

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

        modelBuilder.Entity<ReviewLike>(entity =>
        {
            entity.HasOne(reviewLike => reviewLike.Review)
                .WithMany()
                .HasForeignKey(reviewLike => reviewLike.ReviewId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(reviewLike => reviewLike.User)
                .WithMany()
                .HasForeignKey(reviewLike => reviewLike.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(reviewLike => new
            {
                reviewLike.ReviewId,
                reviewLike.UserId
            })
                .IsUnique();
        });

        modelBuilder.Entity<ReviewComment>(entity =>
        {
            entity.Property(reviewComment => reviewComment.Content)
                .HasMaxLength(500)
                .IsRequired();

            entity.HasOne(reviewComment => reviewComment.Review)
                .WithMany()
                .HasForeignKey(reviewComment => reviewComment.ReviewId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(reviewComment => reviewComment.User)
                .WithMany()
                .HasForeignKey(reviewComment => reviewComment.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}