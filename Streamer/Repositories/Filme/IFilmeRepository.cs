using Streamer.Models;

namespace Streamer.Data;

public interface IFilmeRepository
{
    void Cadastrar(Filme filme);
    List<Filme> Listar();
    Filme? BuscarId(int id);                 
    void Atualizar(Filme filme);
    void Remover(Filme filme);
}
