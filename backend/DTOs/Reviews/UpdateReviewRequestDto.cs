using System.ComponentModel.DataAnnotations;

namespace AfterCredits.Api.DTOs.Reviews;

public class UpdateReviewRequestDto
{
    [Range(typeof(decimal), "0.5", "5.0")]
    public decimal Rating { get; set; }

    [Required]
    [StringLength(2000)]
    public string Content { get; set; } = string.Empty;
}