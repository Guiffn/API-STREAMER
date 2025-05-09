namespace Streamer.Services
{
    using Microsoft.IdentityModel.Tokens;
    using System.IdentityModel.Tokens.Jwt;
    using System.Security.Claims;
    using System.Text;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.Configuration;
    using Streamer.Models;

    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;
        private readonly PasswordHasher<Usuario> _hasher = new();

        public AuthService(IConfiguration config)
        {
            _config = config;
        }

        public string GerarTokenJwt(Usuario usuario)
        {
            var jwt = _config.GetSection("JwtSettings");
            var chaveSecreta = jwt["SecretKey"] ?? throw new ArgumentNullException("Chave secreta não configurada.");
            var emissor      = jwt["Issuer"]     ?? throw new ArgumentNullException("Emissor não configurado.");
            var publico      = jwt["Audience"]   ?? throw new ArgumentNullException("Público não configurado.");
            int.TryParse(jwt["TokenExpiryHours"], out var horas);

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(chaveSecreta));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, usuario.Email ?? ""),
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Role, usuario.Permissao.ToString())
            };

            var token = new JwtSecurityToken(
                issuer:             emissor,
                audience:           publico,
                claims:             claims,
                expires:            DateTime.UtcNow.AddHours(horas > 0 ? horas : 2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public bool VerificarSenha(string senhaTextoPlano, string senhaHash)
        {
            var fake = new Usuario { Senha = senhaHash };
            var res  = _hasher.VerifyHashedPassword(fake, senhaHash, senhaTextoPlano);
            return res == PasswordVerificationResult.Success;
        }

        public string GerarHashSenha(string senhaTextoPlano)
        {
          
        var dummy = new Usuario { Nome = string.Empty, Email = string.Empty, Senha = string.Empty };
        return _hasher.HashPassword(dummy, senhaTextoPlano);
        }

    }
}