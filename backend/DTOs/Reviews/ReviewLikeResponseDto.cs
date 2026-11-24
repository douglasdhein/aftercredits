namespace AfterCredits.Api.DTOs.Reviews;

public class ReviewLikeResponseDto
{
    public int ReviewId { get; set; }

    public int LikesCount { get; set; }

    public bool IsLikedByCurrentUser { get; set; }
}