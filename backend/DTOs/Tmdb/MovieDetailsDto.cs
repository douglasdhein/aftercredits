using System.Text.Json.Serialization;

namespace AfterCredits.Api.DTOs.Tmdb;

public class MovieDetailsDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Overview { get; set; } = string.Empty;

    [JsonPropertyName("poster_path")]
    public string? PosterPath { get; set; }

    [JsonPropertyName("backdrop_path")]
    public string? BackdropPath { get; set; }

    [JsonPropertyName("release_date")]
    public string ReleaseDate { get; set; } = string.Empty;

    [JsonPropertyName("vote_average")]
    public double VoteAverage { get; set; }

    public int? Runtime { get; set; }

    public List<GenreDto> Genres { get; set; } = [];
}