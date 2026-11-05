using System.Security.Claims;
using AfterCredits.Api.Data;
using AfterCredits.Api.DTOs.Reviews;
using AfterCredits.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AfterCredits.Api.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<ReviewResponseDto>>> GetReviews(
        [FromQuery] int mediaId,
        [FromQuery] string mediaType
    )
    {
        if (mediaId <= 0)
        {
            return BadRequest(new
            {
                message = "Media ID must be greater than zero."
            });
        }

        var normalizedMediaType = mediaType.Trim().ToLowerInvariant();

        if (normalizedMediaType != "movie" && normalizedMediaType != "tv")
        {
            return BadRequest(new
            {
                message = "Media type must be either 'movie' or 'tv'."
            });
        }

        var reviews = await _context.Reviews
            .AsNoTracking()
            .Where(review =>
                review.MediaId == mediaId &&
                review.MediaType == normalizedMediaType
            )
            .OrderByDescending(review => review.CreatedAt)
            .Select(review => new ReviewResponseDto
            {
                Id = review.Id,
                UserId = review.UserId,
                UserName = review.User.Name,
                MediaId = review.MediaId,
                MediaType = review.MediaType,
                Rating = review.Rating,
                Content = review.Content,
                CreatedAt = review.CreatedAt,
                UpdatedAt = review.UpdatedAt
            })
            .ToListAsync();

        return Ok(reviews);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<ReviewResponseDto>> GetCurrentUserReview(
        [FromQuery] int mediaId,
        [FromQuery] string mediaType
    )
    {
        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!int.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        if (mediaId <= 0)
        {
            return BadRequest(new
            {
                message = "Media ID must be greater than zero."
            });
        }

        var normalizedMediaType = mediaType.Trim().ToLowerInvariant();

        if (normalizedMediaType != "movie" && normalizedMediaType != "tv")
        {
            return BadRequest(new
            {
                message = "Media type must be either 'movie' or 'tv'."
            });
        }

        var review = await _context.Reviews
            .AsNoTracking()
            .Where(review =>
                review.UserId == userId &&
                review.MediaId == mediaId &&
                review.MediaType == normalizedMediaType
            )
            .Select(review => new ReviewResponseDto
            {
                Id = review.Id,
                UserId = review.UserId,
                UserName = review.User.Name,
                MediaId = review.MediaId,
                MediaType = review.MediaType,
                Rating = review.Rating,
                Content = review.Content,
                CreatedAt = review.CreatedAt,
                UpdatedAt = review.UpdatedAt
            })
            .FirstOrDefaultAsync();

        if (review is null)
        {
            return NotFound(new
            {
                message = "Review not found."
            });
        }

        return Ok(review);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ReviewResponseDto>> CreateReview(
        CreateReviewRequestDto request
    )
    {
        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!int.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        if (request.Rating % 0.5m != 0)
        {
            return BadRequest(new
            {
                message = "Rating must increase in 0.5 increments."
            });
        }

        var mediaType = request.MediaType.Trim().ToLowerInvariant();

        var reviewAlreadyExists = await _context.Reviews.AnyAsync(
            review =>
                review.UserId == userId &&
                review.MediaId == request.MediaId &&
                review.MediaType == mediaType
        );

        if (reviewAlreadyExists)
        {
            return Conflict(new
            {
                message = "You have already reviewed this title."
            });
        }

        var user = await _context.Users.FindAsync(userId);

        if (user is null)
        {
            return Unauthorized();
        }

        var review = new Review
        {
            UserId = userId,
            MediaId = request.MediaId,
            MediaType = mediaType,
            Rating = request.Rating,
            Content = request.Content.Trim()
        };

        _context.Reviews.Add(review);

        await _context.SaveChangesAsync();

        var response = new ReviewResponseDto
        {
            Id = review.Id,
            UserId = review.UserId,
            UserName = user.Name,
            MediaId = review.MediaId,
            MediaType = review.MediaType,
            Rating = review.Rating,
            Content = review.Content,
            CreatedAt = review.CreatedAt,
            UpdatedAt = review.UpdatedAt
        };

        return StatusCode(
            StatusCodes.Status201Created,
            response
        );
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ReviewResponseDto>> UpdateReview(
        int id,
        UpdateReviewRequestDto request
    )
    {
        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!int.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        if (request.Rating % 0.5m != 0)
        {
            return BadRequest(new
            {
                message = "Rating must increase in 0.5 increments."
            });
        }

        var review = await _context.Reviews
            .Include(review => review.User)
            .FirstOrDefaultAsync(review => review.Id == id);

        if (review is null)
        {
            return NotFound(new
            {
                message = "Review not found."
            });
        }

        if (review.UserId != userId)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new
                {
                    message = "You cannot edit this review."
                }
            );
        }

        review.Rating = request.Rating;
        review.Content = request.Content.Trim();
        review.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var response = new ReviewResponseDto
        {
            Id = review.Id,
            UserId = review.UserId,
            UserName = review.User.Name,
            MediaId = review.MediaId,
            MediaType = review.MediaType,
            Rating = review.Rating,
            Content = review.Content,
            CreatedAt = review.CreatedAt,
            UpdatedAt = review.UpdatedAt
        };

        return Ok(response);
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!int.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        var review = await _context.Reviews
            .FirstOrDefaultAsync(review => review.Id == id);

        if (review is null)
        {
            return NotFound(new
            {
                message = "Review not found."
            });
        }

        if (review.UserId != userId)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new
                {
                    message = "You cannot delete this review."
                }
            );
        }

        _context.Reviews.Remove(review);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}