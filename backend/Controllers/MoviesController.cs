using AfterCredits.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AfterCredits.Api.Controllers;

[ApiController]
[Route("api/movies")]
public class MoviesController : ControllerBase
{
    private readonly TmdbService _tmdbService;

    public MoviesController(TmdbService tmdbService)
    {
        _tmdbService = tmdbService;
    }

    [HttpGet("popular")]
    public async Task<IActionResult> GetPopularMovies()
    {
        var movies = await _tmdbService.GetPopularMoviesAsync();

        return Ok(movies);
    }

    [HttpGet("trending")]
    public async Task<IActionResult> GetTrendingMovies()
    {
        var movies = await _tmdbService.GetTrendingMoviesAsync();

        return Ok(movies);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetMovieDetails(int id)
    {
        var movie = await _tmdbService.GetMovieDetailsAsync(id);

        return Ok(movie);
    }

    [HttpGet]
    public async Task<IActionResult> GetMovies([FromQuery] int page = 1)
    {
        var movies = await _tmdbService.GetMoviesAsync(page);

        return Ok(movies);
    }
}