namespace AfterCredits.Api.DTOs.Reviews;

public class ReviewResponseDto
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string UserName { get; set; } = string.Empty;

    public int MediaId { get; set; }

    public string MediaType { get; set; } = string.Empty;

    public decimal Rating { get; set; }

    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}