using Microsoft.AspNetCore.Mvc;
using Streamer.Data;

namespace Streamer.Controllers
{
    [Route("api/comentario")]
    [ApiController]
    public class ComentarioController : ControllerBase
    {
        private readonly AppDataContext _ctx;
        private readonly IComentarioRepository _repository;

        public ComentarioController(AppDataContext ctx, IComentarioRepository repository)
        {
            _ctx = ctx;
            _repository = repository;
        }

        [HttpPost("cadastrar")]
        public IActionResult Cadastrar([FromBody] Comentario comentario)
        {
            _repository.Cadastrar(comentario);
            return Created("", comentario);
        }

        [HttpGet("listar")]
        public IActionResult Listar()
        {
            return Ok(_repository.Listar());
        }

        [HttpDelete("deletar/{id}")]
        public IActionResult Deletar(int id)
        {
            var comentario = _repository.BuscarId(id);
            if (comentario == null)
            {
                return NotFound(new { mensagem = "Comentário não encontrado" });
            }
            _repository.Remover(comentario);
            return Ok();
        }
    }
}