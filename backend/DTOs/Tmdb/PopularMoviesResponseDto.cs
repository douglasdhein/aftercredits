using System.Text.Json.Serialization;

namespace AfterCredits.Api.DTOs.Tmdb;

public class PopularMoviesResponseDto
{
    public int Page { get; set; }

    public List<MovieDto> Results { get; set; } = [];

    [JsonPropertyName("total_pages")]
    public int TotalPages { get; set; }

    [JsonPropertyName("total_results")]
    public int TotalResults { get; set; }
}