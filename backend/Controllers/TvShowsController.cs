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
}