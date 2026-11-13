using System.Text.Json.Serialization;

namespace AfterCredits.Api.DTOs.Tmdb;

public class TvAggregateCastMemberDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("profile_path")]
    public string? ProfilePath { get; set; }

    public int Order { get; set; }

    [JsonPropertyName("total_episode_count")]
    public int TotalEpisodeCount { get; set; }

    public List<TvCastRoleDto> Roles { get; set; } = [];
}