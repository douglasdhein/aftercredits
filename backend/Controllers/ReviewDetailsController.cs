using System.Security.Claims;
using AfterCredits.Api.Data;
using AfterCredits.Api.DTOs.Reviews;
using AfterCredits.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AfterCredits.Api.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewDetailsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly TmdbService _tmdbService;

    public ReviewDetailsController(
        AppDbContext context,
        TmdbService tmdbService
    )
    {
        _context = context;
        _tmdbService = tmdbService;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ReviewFeedItemDto>> GetReviewDetails(
        int id
    )
    {
        if (id <= 0)
        {
            return BadRequest(new
            {
                message = "Review ID must be greater than zero."
            });
        }

        int? currentUserId = null;

        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (
            User.Identity?.IsAuthenticated == true &&
            int.TryParse(userIdValue, out var userId)
        )
        {
            currentUserId = userId;
        }

        var review = await _context.Reviews
            .AsNoTracking()
            .Where(review => review.Id == id)
            .Select(review => new ReviewFeedItemDto
            {
                Id = review.Id,
                UserId = review.UserId,
                UserName = review.User.Name,
                MediaId = review.MediaId,
                MediaType = review.MediaType,
                Rating = review.Rating,
                Content = review.Content,
                CreatedAt = review.CreatedAt,
                UpdatedAt = review.UpdatedAt,

                LikesCount = _context.ReviewLikes.Count(
                    reviewLike =>
                        reviewLike.ReviewId == review.Id
                ),

                IsLikedByCurrentUser =
                    currentUserId.HasValue &&
                    _context.ReviewLikes.Any(reviewLike =>
                        reviewLike.ReviewId == review.Id &&
                        reviewLike.UserId == currentUserId
                    ),

                CommentsCount = _context.ReviewComments.Count(
                    reviewComment =>
                        reviewComment.ReviewId == review.Id
                )
            })
            .FirstOrDefaultAsync();

        if (review is null)
        {
            return NotFound(new
            {
                message = "Review not found."
            });
        }

        var mediaInfo = await GetMediaInfoAsync(
            review.MediaId,
            review.MediaType
        );

        review.MediaTitle = mediaInfo.Title;
        review.PosterPath = mediaInfo.PosterPath;

        return Ok(review);
    }

    private async Task<(string Title, string? PosterPath)> GetMediaInfoAsync(
        int mediaId,
        string mediaType
    )
    {
        try
        {
            if (mediaType == "movie")
            {
                var movie = await _tmdbService.GetMovieDetailsAsync(
                    mediaId
                );

                return (
                    movie.Title,
                    movie.PosterPath
                );
            }

            var tvShow = await _tmdbService.GetTvShowDetailsAsync(
                mediaId
            );

            return (
                tvShow.Name,
                tvShow.PosterPath
            );
        }
        catch (HttpRequestException)
        {
            return (
                "Title unavailable",
                null
            );
        }
        catch (InvalidOperationException)
        {
            return (
                "Title unavailable",
                null
            );
        }
    }
}