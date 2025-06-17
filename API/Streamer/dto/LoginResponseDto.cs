using Streamer.Models;

namespace Streamer.Dto;

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public User User { get; set; } = null!;
} 