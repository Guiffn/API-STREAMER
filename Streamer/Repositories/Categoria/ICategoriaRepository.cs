using Streamer.Models;

namespace Streamer.Data;

public interface ICategoriaRepository
{
    void CadastrarCate(Categoria categoria);
    void AtualizarCate(Categoria categoria);
    Categoria? BuscarCategoria(int id);     
    List<Categoria> ListarCate();
}
