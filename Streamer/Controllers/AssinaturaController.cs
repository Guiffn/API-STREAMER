using Microsoft.AspNetCore.Mvc;
using Streamer.Data;

namespace API_STREAMER.Streamer.Controllers
{
    [Route("api/assinatura")]
    [ApiController]
    public class AssinaturaController : ControllerBase
    {
        private readonly AppDataContext _ctx;
        private readonly IAssinaturaRepository _repository;

        public AssinaturaController(AppDataContext ctx, IAssinaturaRepository repository)
        {
            _ctx = ctx;
            _repository = repository;
        }

        [HttpPost("cadastrar")]
        public IActionResult Cadastrar([FromBody] Assinatura assinatura)
        {
            _repository.Cadastrar(assinatura);
            return Created("", assinatura);
        }

        [HttpGet("listar")]
        public IActionResult Listar()
        {
            return Ok(_repository.Listar());
        }

        [HttpDelete("deletar/{id}")]
        public IActionResult Deletar(int id)
        {   
         var assinatura = _repository.BuscarId(id);
        if (assinatura == null)
        return NotFound(new { mensagem = "Assinatura não encontrada" });

         _repository.Remover(assinatura);
         return Ok();
        }

    }
}