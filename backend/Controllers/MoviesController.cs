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
}