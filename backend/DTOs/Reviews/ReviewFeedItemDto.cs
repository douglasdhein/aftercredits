namespace AfterCredits.Api.DTOs.Reviews;

public class ReviewFeedItemDto
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string UserName { get; set; } = string.Empty;

    public int MediaId { get; set; }

    public string MediaType { get; set; } = string.Empty;

    public string MediaTitle { get; set; } = string.Empty;

    public string? PosterPath { get; set; }

    public decimal Rating { get; set; }

    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int LikesCount { get; set; }

    public bool IsLikedByCurrentUser { get; set; }

    public int CommentsCount { get; set; }
}