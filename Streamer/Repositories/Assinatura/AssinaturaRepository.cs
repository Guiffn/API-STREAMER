using Microsoft.EntityFrameworkCore;
using Streamer.Data;

public class AssinaturaRepository : IAssinaturaRepository
{
    private readonly AppDataContext _ctx;

    public AssinaturaRepository(AppDataContext ctx)
    {
        _ctx = ctx;
    }

    public void Cadastrar(Assinatura assinatura)
    {
        _ctx.Assinaturas.Add(assinatura);
        _ctx.SaveChanges();
    }

    public List<Assinatura> Listar()
    {
        return _ctx.Assinaturas.Include(a => a.Usuario).ToList();
    }

    public void Remover(Assinatura assinatura)
    {
        _ctx.Assinaturas.Remove(assinatura);
        _ctx.SaveChanges();
    }

    public Assinatura? BuscarId(int id)
    {
        return _ctx.Assinaturas
                   .Include(a => a.Usuario)
                   .FirstOrDefault(a => a.Id == id);
    }

}