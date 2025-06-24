using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Streamer.Dto;
using Streamer.Models;
using Streamer.Repositories.Users;

namespace Streamer.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUsersRepository _usersRepository;

    public UserController(IUsersRepository usersRepository)
    {
        _usersRepository = usersRepository;
    }

    [HttpPost]
    [AllowAnonymous]
    public IActionResult Create([FromBody] User user)
    {
        var userExists = _usersRepository.GetByEmail(user.Email);
        if (userExists != null)
        {
            return BadRequest(new { mensagem = "Usuário existente. Tente novamente." });
        }

        _usersRepository.Create(user);
        return Created("", user);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public IActionResult List()
    {
        var users = _usersRepository.List();
        return Ok(users);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult Get(int id)
    {
        var user = _usersRepository.Get(id);
        if (user == null)
        {
            return NotFound(new { mensagem = "Usuário não encontrado" });
        }

        return Ok(user);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult Update(int id, [FromBody] UserUpdateDto user)
    {
        var userExists = _usersRepository.Get(id);
        if (userExists == null)
        {
            return NotFound(new { mensagem = "Usuário não encontrado" });
        }

        if (!string.IsNullOrWhiteSpace(user.Name)) userExists.Name = user.Name;
        if (!string.IsNullOrWhiteSpace(user.Email)) userExists.Email = user.Email;
        if (!string.IsNullOrWhiteSpace(user.Password)) userExists.Password = user.Password;

        _usersRepository.Update(userExists);
        return Ok(userExists);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult Delete(int id)
    {
        var user = _usersRepository.Get(id);
        if (user == null)
        {
            return NotFound(new { mensagem = "Usuário não encontrado" });
        }

        _usersRepository.Delete(id);
        return NoContent();
    }
}