using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Streamer.Dto;
using Streamer.Models;
using Streamer.Repositories.Categories;

namespace Streamer.Controllers;

[ApiController]
[Route("api/category")]
[Authorize]
public class CategoryController : ControllerBase
{
    private readonly ICategoriesRepository _categoriesRepository;

    public CategoryController(ICategoriesRepository categoriesRepository)
    {
        _categoriesRepository = categoriesRepository;
    }

    [HttpPost()]
    public IActionResult Create([FromBody] Category category)
    {
        var categoryExists = _categoriesRepository.Get(category.Id);
        if(categoryExists != null){
            return BadRequest(new{mensagem="Categoria existente tente novamente"});
        }
        _categoriesRepository.Create(category);
        return Created("", category);
    }

    [HttpGet()]
    public IActionResult List()
    {
        var categories = _categoriesRepository.List();
        return Ok(categories);
    }

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var category = _categoriesRepository.Get(id);
        if (category == null) {
            return NotFound(new { mensagem = "Usuário não encontrado" });
        }
            
        return Ok(category);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] CategoryUpdateDto categoryBody)
    {
        var categoryExists = _categoriesRepository.Get(id);
        if (categoryExists == null)
        {
            return NotFound(new { mensagem = "Categoria não encontrada" });
        }

        if (!string.IsNullOrWhiteSpace(categoryBody.Name))
        {
            categoryExists.Name = categoryBody.Name;
        }

        if (!string.IsNullOrWhiteSpace(categoryBody.Description))
        {
            categoryExists.Description = categoryBody.Description;
        }

        _categoriesRepository.Update(categoryExists);
        return Ok(categoryExists);
    }
    
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var category = _categoriesRepository.Get(id);
        if (category == null)
            return NotFound(new { mensagem = "Categoria não encontrada" });
            
        _categoriesRepository.Delete(id);
        return NoContent();
    }
}
