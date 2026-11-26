namespace AfterCredits.Api.DTOs.Reviews;

public class ReviewCommentResponseDto
{
    public int Id { get; set; }

    public int ReviewId { get; set; }

    public int UserId { get; set; }

    public string UserName { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}