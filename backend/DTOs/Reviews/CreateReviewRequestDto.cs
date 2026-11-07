using System.ComponentModel.DataAnnotations;

namespace AfterCredits.Api.DTOs.Reviews;

public class CreateReviewRequestDto
{
    [Range(1, int.MaxValue)]
    public int MediaId { get; set; }

    [Required]
    [RegularExpression("^(movie|tv)$")]
    public string MediaType { get; set; } = string.Empty;

    [Range(
        typeof(decimal),
        "0.5",
        "5.0",
        ParseLimitsInInvariantCulture = true,
        ConvertValueInInvariantCulture = true
    )]
    public decimal Rating { get; set; }

    [Required]
    [StringLength(2000)]
    public string Content { get; set; } = string.Empty;
}