using Microsoft.AspNetCore.Mvc;
using Streamer.Data;
using Streamer.Models;

namespace Streamer.Controllers
{
    [Route("api/categoria")]
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        private readonly ICategoriaRepository _repository;

        // Injeção de dependência do repositório
        public CategoriaController(ICategoriaRepository repository)
        {
            _repository = repository;
        }

        [HttpPost("cadastrar")]
        public IActionResult Cadastrar([FromBody] Categoria categoria)
        {
            var categoriaExistente = _repository.ListarCate().FirstOrDefault(x => x.Nome.ToLower() == categoria.Nome.ToLower());
            if (categoriaExistente != null)
            {
                return NotFound(new { mensagem = "Categoria já foi cadastrada" });
            }

            _repository.CadastrarCate(categoria);
            return Created("", categoria);
        }

        [HttpPut("atualizar")]
        public IActionResult Update(int id, [FromBody] Categoria categoriaAlterada)
        {
            var categoria = _repository.BuscarCategoria(id);
            if (categoria == null)
            {
                return NotFound(new { mensagem = "A categoria não foi encontrada" });
            }

            categoria.Nome = categoriaAlterada.Nome;
            _repository.AtualizarCate(categoria); // Atualiza a categoria no repositório
            return Ok();
        }

        [HttpGet("listar")]
        public IActionResult Listar()
        {
            return Ok(_repository.ListarCate());
        }
    }
}
