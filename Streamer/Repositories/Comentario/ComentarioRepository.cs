using Microsoft.EntityFrameworkCore;
using Streamer.Data;

public class ComentarioRepository : IComentarioRepository
{
    private readonly AppDataContext _ctx;

    public ComentarioRepository(AppDataContext ctx)
    {
        _ctx = ctx;
    }

    public void Cadastrar(Comentario comentario)
    {
        _ctx.Comentarios.Add(comentario);
        _ctx.SaveChanges();
    }

    public List<Comentario> Listar()
    {
        return _ctx.Comentarios.Include(c => c.Usuario).Include(c => c.Filme).ToList();
    }

    public void Remover(Comentario comentario)
    {
        _ctx.Comentarios.Remove(comentario);
        _ctx.SaveChanges();
    }

    public Comentario BuscarId(int id)
    {
    return _ctx.Comentarios
               .Include(c => c.Usuario)
               .Include(c => c.Filme)
               .FirstOrDefault(c => c.Id == id)!;
    }

}