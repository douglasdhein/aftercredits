using System.Text.Json.Serialization;

namespace AfterCredits.Api.DTOs.Tmdb;

public class TrendingTvShowsResponseDto
{
    public int Page { get; set; }

    public List<TvShowDto> Results { get; set; } = [];

    [JsonPropertyName("total_pages")]
    public int TotalPages { get; set; }

    [JsonPropertyName("total_results")]
    public int TotalResults { get; set; }
}