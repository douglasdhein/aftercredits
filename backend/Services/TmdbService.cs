using System.Net.Http.Headers;

namespace AfterCredits.Api.Services;

public class TmdbService
{
    private readonly HttpClient _httpClient;

    public TmdbService(HttpClient httpClient, IConfiguration configuration)
    {
        var accessToken = configuration["Tmdb:AccessToken"];

        if (string.IsNullOrEmpty(accessToken))
        {
            throw new InvalidOperationException(
                "TMDB access token is not configured."
            );
        }

        _httpClient = httpClient;

        _httpClient.BaseAddress =
            new Uri("https://api.themoviedb.org/3/");

        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", accessToken);
    }

    public async Task<string> GetPopularMoviesAsync()
    {
        var response = await _httpClient.GetAsync(
            "movie/popular?language=en-US"
        );

        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();

        return content;
    }
}

