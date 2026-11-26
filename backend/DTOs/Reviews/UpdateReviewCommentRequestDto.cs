using System.ComponentModel.DataAnnotations;

namespace AfterCredits.Api.DTOs.Reviews;

public class UpdateReviewCommentRequestDto
{
    [Required(ErrorMessage = "Comment content is required.")]
    [MaxLength(500, ErrorMessage = "Comment cannot exceed 500 characters.")]
    public string Content { get; set; } = string.Empty;
}