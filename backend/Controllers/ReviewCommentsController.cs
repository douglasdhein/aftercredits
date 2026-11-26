using System.Security.Claims;
using AfterCredits.Api.Data;
using AfterCredits.Api.DTOs.Reviews;
using AfterCredits.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AfterCredits.Api.Controllers;

[ApiController]
[Route("api/reviews/{reviewId:int}/comments")]
public class ReviewCommentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewCommentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<ReviewCommentResponseDto>>> GetComments(
        int reviewId
    )
    {
        var reviewExists = await _context.Reviews
            .AnyAsync(review => review.Id == reviewId);

        if (!reviewExists)
        {
            return NotFound(new
            {
                message = "Review not found."
            });
        }

        var comments = await _context.ReviewComments
            .AsNoTracking()
            .Where(comment => comment.ReviewId == reviewId)
            .OrderBy(comment => comment.CreatedAt)
            .ThenBy(comment => comment.Id)
            .Select(comment => new ReviewCommentResponseDto
            {
                Id = comment.Id,
                ReviewId = comment.ReviewId,
                UserId = comment.UserId,
                UserName = comment.User.Name,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                UpdatedAt = comment.UpdatedAt
            })
            .ToListAsync();

        return Ok(comments);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ReviewCommentResponseDto>> CreateComment(
        int reviewId,
        CreateReviewCommentRequestDto request
    )
    {
        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!int.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users.FindAsync(userId);

        if (user is null)
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

        var comment = new ReviewComment
        {
            ReviewId = reviewId,
            UserId = userId,
            Content = request.Content.Trim()
        };

        _context.ReviewComments.Add(comment);

        await _context.SaveChangesAsync();

        var response = new ReviewCommentResponseDto
        {
            Id = comment.Id,
            ReviewId = comment.ReviewId,
            UserId = comment.UserId,
            UserName = user.Name,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            UpdatedAt = comment.UpdatedAt
        };

        return StatusCode(
            StatusCodes.Status201Created,
            response
        );
    }

    [Authorize]
    [HttpPut("{commentId:int}")]
    public async Task<ActionResult<ReviewCommentResponseDto>> UpdateComment(
        int reviewId,
        int commentId,
        UpdateReviewCommentRequestDto request
    )
    {
        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!int.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        var comment = await _context.ReviewComments
            .Include(comment => comment.User)
            .FirstOrDefaultAsync(comment =>
                comment.Id == commentId &&
                comment.ReviewId == reviewId
            );

        if (comment is null)
        {
            return NotFound(new
            {
                message = "Comment not found."
            });
        }

        if (comment.UserId != userId)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new
                {
                    message = "You cannot edit this comment."
                }
            );
        }

        comment.Content = request.Content.Trim();
        comment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var response = new ReviewCommentResponseDto
        {
            Id = comment.Id,
            ReviewId = comment.ReviewId,
            UserId = comment.UserId,
            UserName = comment.User.Name,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            UpdatedAt = comment.UpdatedAt
        };

        return Ok(response);
    }

    [Authorize]
    [HttpDelete("{commentId:int}")]
    public async Task<IActionResult> DeleteComment(
        int reviewId,
        int commentId
    )
    {
        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!int.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        var comment = await _context.ReviewComments
            .FirstOrDefaultAsync(comment =>
                comment.Id == commentId &&
                comment.ReviewId == reviewId
            );

        if (comment is null)
        {
            return NotFound(new
            {
                message = "Comment not found."
            });
        }

        if (comment.UserId != userId)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new
                {
                    message = "You cannot delete this comment."
                }
            );
        }

        _context.ReviewComments.Remove(comment);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}