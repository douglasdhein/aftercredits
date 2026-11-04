namespace AfterCredits.Api.Entities;

public class Review
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int MediaId { get; set; }

    public string MediaType { get; set; } = string.Empty;

    public decimal Rating { get; set; }

    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public User User { get; set; } = null!;
}