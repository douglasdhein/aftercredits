using AfterCredits.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AfterCredits.Api.Controllers;

[ApiController]
[Route("api/tv-shows")]
public class TvShowsController : ControllerBase
{
    private readonly TmdbService _tmdbService;

    public TvShowsController(TmdbService tmdbService)
    {
        _tmdbService = tmdbService;
    }

    [HttpGet("trending")]
    public async Task<IActionResult> GetTrendingTvShows()
    {
        var tvShows = await _tmdbService.GetTrendingTvShowsAsync();

        return Ok(tvShows);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetTvShowDetails(int id)
    {
        var tvShow = await _tmdbService.GetTvShowDetailsAsync(id);

        return Ok(tvShow);
    }

    [HttpGet]
    public async Task<IActionResult> GetTvShows([FromQuery] int page = 1)
    {
        var tvShows = await _tmdbService.GetTvShowsAsync(page);

        return Ok(tvShows);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchTvShows(
    [FromQuery] string query,
    [FromQuery] int page = 1
)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return BadRequest("Search query is required.");
        }

        if (page < 1)
        {
            return BadRequest("Page must be greater than zero.");
        }

        var tvShows = await _tmdbService.SearchTvShowsAsync(query, page);

        return Ok(tvShows);
    }
}