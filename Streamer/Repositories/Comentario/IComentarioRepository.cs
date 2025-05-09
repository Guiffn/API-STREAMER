
namespace Streamer.Data
{
  
    public interface IComentarioRepository
    {
    
        void Cadastrar(Comentario comentario);

        List<Comentario> Listar();

        void Remover(Comentario comentario);
        Comentario BuscarId(int id);
    }
}