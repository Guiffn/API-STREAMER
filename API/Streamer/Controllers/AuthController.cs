using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Streamer.Dto;
using Streamer.Models;
using Streamer.Repositories.Users;

namespace Streamer.Controllers;

[ApiController]
[Route("api/auth")]
[Authorize]
public class AuthController : ControllerBase
{
    private readonly IUsersRepository _usersRepository;
    private readonly IConfiguration _configuration;

    public AuthController(
        IUsersRepository usersRepository,
        IConfiguration configuration)
    {
        _usersRepository = usersRepository;
        _configuration = configuration;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public IActionResult Login([FromBody] LoginDto loginDto)
    {
        var user = _usersRepository.GetByEmail(loginDto.Email);
        if (user == null)
        {
            return Unauthorized(new { mensagem = "Email ou senha inválidos" });
        }

        if (user.Password != loginDto.Password)
        {
            return Unauthorized(new { mensagem = "Email ou senha inválidos" });
        }

        var token = GenerateJwtToken(user);

        return Ok(new LoginResponseDto
        {
            Token = token,
        });
    }

    private string GenerateJwtToken(User user)
    {
        var chaveJwt = _configuration["JwtSettings:SecretKey"];
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(chaveJwt!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Permission.ToString()),
            new Claim("UserId", user.Id.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["JwtSettings:Issuer"],
            audience: _configuration["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(Convert.ToDouble(_configuration["JwtSettings:TokenExpiryHours"])),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var user = _usersRepository.Get(int.Parse(userId));
        if (user == null)
            return NotFound();

        return Ok(user);
    }
} 