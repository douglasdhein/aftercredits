using System.Text.Json.Serialization;

namespace AfterCredits.Api.DTOs.Tmdb;

public class CastMemberDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Character { get; set; } = string.Empty;

    [JsonPropertyName("profile_path")]
    public string? ProfilePath { get; set; }

    public int Order { get; set; }
}