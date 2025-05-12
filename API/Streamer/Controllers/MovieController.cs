using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Streamer.Dto;
using Streamer.Models;
using Streamer.Repositories.Movies;
using Streamer.Repositories.Categories;
namespace Streamer.Controllers;

[ApiController]
[Route("api/movie")]
[Authorize]
public class MovieController : ControllerBase
{
    private readonly IMoviesRepository _moviesRepository;
    private readonly ICategoriesRepository _categoriesRepository;

    public MovieController(IMoviesRepository moviesRepository, ICategoriesRepository categoriesRepository) {
        _moviesRepository = moviesRepository;
        _categoriesRepository = categoriesRepository;
    }

    [HttpPost()]
    public IActionResult Create([FromBody] Movie movie) {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) {
            return Unauthorized(new { mensagem = "Token inválido" });
        }

        if (!int.TryParse(userIdClaim.Value, out int userId)) {
            return Unauthorized(new { mensagem = "Token inválido" });
        }

        movie.UserId = userId;

        var category = _categoriesRepository.Get(movie.CategoryId);

        if(category == null){
            return BadRequest(new{mensagem="Categoria não encontrada"});
        }

        _moviesRepository.Create(movie);
        return Created("", movie);
    }

    [HttpGet()]
    public IActionResult List() {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) {
            return Unauthorized(new { mensagem = "Token inválido" });
        }

        if (!int.TryParse(userIdClaim.Value, out int userId)) {
            return Unauthorized(new { mensagem = "Token inválido" });
        }

        var movies = _moviesRepository.ListByUser(userId);
        return Ok(movies);
    }

    [HttpGet("{id}")]
    public IActionResult Get(int id) {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) {
            return Unauthorized(new { mensagem = "Token inválido" });
        }

        if (!int.TryParse(userIdClaim.Value, out int userId)) {
            return Unauthorized(new { mensagem = "Token inválido" });
        }

        var movie = _moviesRepository.Get(id);
        if (movie == null || movie.UserId != userId) {
            return NotFound(new { mensagem = "Filme não encontrado ou não vinculado ao usuário" });
        }

        return Ok(movie);
    }
    
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] MovieUpdateDto movieBody) {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) {
            return Unauthorized(new { mensagem = "Token inválido" });
        }

        if (!int.TryParse(userIdClaim.Value, out int userId)) {
            return Unauthorized(new { mensagem = "Token inválido" });
        }

        var movie = _moviesRepository.Get(id);
        if (movie == null || movie.UserId != userId) {
            return NotFound(new { mensagem = "Filme não encontrado ou não vinculado ao usuário" });
        }

        if (!string.IsNullOrWhiteSpace(movieBody.Title)) {
            movie.Title = movieBody.Title;
        }

        if (!string.IsNullOrWhiteSpace(movieBody.CategoryId)) {
            if (!int.TryParse(movieBody.CategoryId, out int categoryId)) {
                return BadRequest(new { mensagem = "ID da categoria inválido" });
            }

            var category = _categoriesRepository.Get(categoryId);
            if (category == null) {
                return BadRequest(new { mensagem = "Categoria não encontrada" });
            }

            movie.CategoryId = categoryId;
        }

        _moviesRepository.Update(movie);
        return Ok(movie);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id) {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) {
            return Unauthorized(new { mensagem = "Token inválido" });
        }

        if (!int.TryParse(userIdClaim.Value, out int userId)) {
            return Unauthorized(new { mensagem = "Token inválido" });
        }

        var movie = _moviesRepository.Get(id);
        if (movie == null || movie.UserId != userId) {
            return NotFound(new { mensagem = "Filme não encontrado ou não vinculado ao usuário" });
        }

        _moviesRepository.Delete(id);
        return NoContent();
    }
}
