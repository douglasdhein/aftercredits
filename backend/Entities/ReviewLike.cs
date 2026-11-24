namespace AfterCredits.Api.Entities;

public class ReviewLike
{
    public int Id { get; set; }

    public int ReviewId { get; set; }

    public int UserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Review Review { get; set; } = null!;

    public User User { get; set; } = null!;
}