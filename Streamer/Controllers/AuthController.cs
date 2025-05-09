using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Streamer.Data;
using Streamer.Models;


namespace Streamer.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUsuarioRepository _userRepo;

        public AuthController(IAuthService authService, IUsuarioRepository userRepo)
        {
            _authService = authService;
            _userRepo    = userRepo;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public IActionResult Register([FromBody] UsuarioDto dto)
        {
            if (_userRepo.Listar().Any(u => u.Email == dto.Email))
                return BadRequest(new { mensagem = "E-mail já cadastrado" });

            var usuario = new Usuario
            {
                Nome      = dto.Nome,
                Email     = dto.Email,
                Senha     = dto.Senha,      // será hasheada pelo AuthService
                Permissao = Permissao.Usuario
            };

       
            usuario.Senha = _authService.GerarHashSenha(dto.Senha);

            _userRepo.Cadastrar(usuario);
            return Created("", new { usuario.Id, usuario.Nome, usuario.Email });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            var usuario = _userRepo.Listar().FirstOrDefault(u => u.Email == dto.Email);
            if (usuario == null ||
                !_authService.VerificarSenha(dto.Senha, usuario.Senha))
            {
                return Unauthorized(new { mensagem = "Credenciais inválidas" });
            }

            var token = _authService.GerarTokenJwt(usuario);
            return Ok(new { token });
        }
    }

    


    public class LoginDto
    {
    public string Email { get; set; } = string.Empty;    
    public string Senha { get; set; } = string.Empty;
    }

public class UsuarioDto
    {
    public string Nome  { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
    }

}
