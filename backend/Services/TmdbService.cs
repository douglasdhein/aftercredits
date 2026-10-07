using System.Net.Http.Headers;
using AfterCredits.Api.DTOs.Tmdb;

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

    public async Task<PopularMoviesResponseDto> GetPopularMoviesAsync()
    {
        var response = await _httpClient.GetAsync(
            "movie/popular?language=en-US"
        );

        response.EnsureSuccessStatusCode();

        var movies =
            await response.Content.ReadFromJsonAsync<PopularMoviesResponseDto>();

        if (movies is null)
        {
            throw new InvalidOperationException(
                "Unable to read TMDB popular movies response."
            );
        }

        return movies;
    }
}

