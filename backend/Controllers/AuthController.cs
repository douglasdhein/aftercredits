using AfterCredits.Api.Data;
using AfterCredits.Api.DTOs.Auth;
using AfterCredits.Api.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AfterCredits.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher<User> _passwordHasher;

    public AuthController(
        AppDbContext context,
        IPasswordHasher<User> passwordHasher
    )
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequestDto request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var emailAlreadyExists = await _context.Users
            .AnyAsync(user => user.Email == email);

        if (emailAlreadyExists)
        {
            return Conflict(new
            {
                message = "Email is already registered."
            });
        }

        var user = new User
        {
            Name = request.Name.Trim(),
            Email = email
        };

        user.PasswordHash = _passwordHasher.HashPassword(
            user,
            request.Password
        );

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        var response = new RegisterResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            CreatedAt = user.CreatedAt
        };

        return StatusCode(
            StatusCodes.Status201Created,
            response
        );
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDto request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await _context.Users
            .FirstOrDefaultAsync(user => user.Email == email);

        if (user is null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        var passwordResult = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            request.Password
        );

        if (passwordResult == PasswordVerificationResult.Failed)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        var response = new LoginResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email
        };

        return Ok(response);
    }
}