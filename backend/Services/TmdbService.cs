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

    public async Task<TrendingTvShowsResponseDto> GetTrendingTvShowsAsync()
    {
        var response = await _httpClient.GetAsync(
            "trending/tv/day?language=en-US"
        );

        response.EnsureSuccessStatusCode();

        var tvShows =
            await response.Content.ReadFromJsonAsync<TrendingTvShowsResponseDto>();

        if (tvShows is null)
        {
            throw new InvalidOperationException(
                "Unable to read TMDB trending TV shows response."
            );
        }

        return tvShows;
    }

    public async Task<TrendingMoviesResponseDto> GetTrendingMoviesAsync()
    {
        var response = await _httpClient.GetAsync(
            "trending/movie/day?language=en-US"
        );

        response.EnsureSuccessStatusCode();

        var movies =
            await response.Content.ReadFromJsonAsync<TrendingMoviesResponseDto>();

        if (movies is null)
        {
            throw new InvalidOperationException(
                "Unable to read TMDB trending movies response."
            );
        }

        return movies;
    }

    public async Task<MovieDetailsDto> GetMovieDetailsAsync(int id)
    {
        var response = await _httpClient.GetAsync(
            $"movie/{id}?language=en-US"
        );

        response.EnsureSuccessStatusCode();

        var movie =
            await response.Content.ReadFromJsonAsync<MovieDetailsDto>();

        if (movie is null)
        {
            throw new InvalidOperationException(
                "Unable to read TMDB movie details response."
            );
        }

        return movie;
    }

    public async Task<TvShowDetailsDto> GetTvShowDetailsAsync(int id)
    {
        var response = await _httpClient.GetAsync(
            $"tv/{id}?language=en-US"
        );

        response.EnsureSuccessStatusCode();

        var tvShow =
            await response.Content.ReadFromJsonAsync<TvShowDetailsDto>();

        if (tvShow is null)
        {
            throw new InvalidOperationException(
                "Unable to read TMDB TV show details response."
            );
        }

        return tvShow;
    }

    public async Task<PopularMoviesResponseDto> GetMoviesAsync(int page)
    {
        var response = await _httpClient.GetAsync(
            $"discover/movie?language=en-US&page={page}"
        );

        response.EnsureSuccessStatusCode();

        var movies =
            await response.Content.ReadFromJsonAsync<PopularMoviesResponseDto>();

        if (movies is null)
        {
            throw new InvalidOperationException(
                "Unable to read TMDB movies response."
            );
        }

        return movies;
    }

    public async Task<TrendingTvShowsResponseDto> GetTvShowsAsync(int page)
    {
        var response = await _httpClient.GetAsync(
            $"discover/tv?language=en-US&page={page}"
        );

        response.EnsureSuccessStatusCode();

        var tvShows =
            await response.Content.ReadFromJsonAsync<TrendingTvShowsResponseDto>();

        if (tvShows is null)
        {
            throw new InvalidOperationException(
                "Unable to read TMDB TV shows response."
            );
        }

        return tvShows;
    }

    public async Task<PopularMoviesResponseDto> SearchMoviesAsync(string query)
    {
        var encodedQuery = Uri.EscapeDataString(query);

        var response = await _httpClient.GetAsync(
            $"search/movie?query={encodedQuery}&include_adult=false&language=en-US&page=1"
        );

        response.EnsureSuccessStatusCode();

        var movies =
            await response.Content.ReadFromJsonAsync<PopularMoviesResponseDto>();

        if (movies is null)
        {
            throw new InvalidOperationException(
                "Unable to read TMDB movie search response."
            );
        }

        return movies;
    }
}

