using System.Security.Claims;
using AfterCredits.Api.Data;
using AfterCredits.Api.DTOs.Reviews;
using AfterCredits.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace AfterCredits.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/reviews/{reviewId:int}/likes")]
public class ReviewLikesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewLikesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<ReviewLikeResponseDto>> LikeReview(
        int reviewId
    )
    {
        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!int.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        var userExists = await _context.Users
            .AnyAsync(user => user.Id == userId);

        if (!userExists)
        {
            return Unauthorized();
        }

        var reviewExists = await _context.Reviews
            .AnyAsync(review => review.Id == reviewId);

        if (!reviewExists)
        {
            return NotFound(new
            {
                message = "Review not found."
            });
        }

        var likeAlreadyExists = await _context.ReviewLikes
            .AnyAsync(reviewLike =>
                reviewLike.ReviewId == reviewId &&
                reviewLike.UserId == userId
            );

        if (!likeAlreadyExists)
        {
            var reviewLike = new ReviewLike
            {
                ReviewId = reviewId,
                UserId = userId
            };

            _context.ReviewLikes.Add(reviewLike);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException exception)
                when (
                    exception.InnerException is PostgresException
                    postgresException &&
                    postgresException.SqlState ==
                        PostgresErrorCodes.UniqueViolation &&
                    postgresException.ConstraintName ==
                        "IX_ReviewLikes_ReviewId_UserId"
                )
            {
                _context.Entry(reviewLike).State =
                    EntityState.Detached;
            }
        }

        var likesCount = await _context.ReviewLikes
            .CountAsync(reviewLike =>
                reviewLike.ReviewId == reviewId
            );

        var response = new ReviewLikeResponseDto
        {
            ReviewId = reviewId,
            LikesCount = likesCount,
            IsLikedByCurrentUser = true
        };

        return Ok(response);
    }

    [HttpDelete]
    public async Task<ActionResult<ReviewLikeResponseDto>> UnlikeReview(
        int reviewId
    )
    {
        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!int.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        var userExists = await _context.Users
            .AnyAsync(user => user.Id == userId);

        if (!userExists)
        {
            return Unauthorized();
        }

        var reviewExists = await _context.Reviews
            .AnyAsync(review => review.Id == reviewId);

        if (!reviewExists)
        {
            return NotFound(new
            {
                message = "Review not found."
            });
        }

        await _context.ReviewLikes
            .Where(reviewLike =>
                reviewLike.ReviewId == reviewId &&
                reviewLike.UserId == userId
            )
            .ExecuteDeleteAsync();

        var likesCount = await _context.ReviewLikes
            .CountAsync(reviewLike =>
                reviewLike.ReviewId == reviewId
            );

        var response = new ReviewLikeResponseDto
        {
            ReviewId = reviewId,
            LikesCount = likesCount,
            IsLikedByCurrentUser = false
        };

        return Ok(response);
    }
}