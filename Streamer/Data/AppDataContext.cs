using Microsoft.EntityFrameworkCore;
using Streamer.Models;

public class AppDataContext : DbContext
{
    public AppDataContext(DbContextOptions<AppDataContext> options)
        : base(options) { }

    public DbSet<Filme>      Filmes      { get; set; }
    public DbSet<Usuario>    Usuarios    { get; set; }
    public DbSet<Comentario> Comentarios { get; set; }
    public DbSet<Assinatura> Assinaturas { get; set; }
    public DbSet<Categoria>  Categorias  { get; set; }

    protected override void OnModelCreating(ModelBuilder model)
    {
        // Filme → Categoria (muitos-para-um)
        model.Entity<Filme>()
            .HasOne(f => f.Categoria)
            .WithMany(c => c.Filmes)
            .HasForeignKey(f => f.CategoriaId)
            .OnDelete(DeleteBehavior.Restrict);

        // Comentario → Usuario (muitos-para-um)
        model.Entity<Comentario>()
            .HasOne(c => c.Usuario)
            .WithMany(u => u.Comentarios)
            .HasForeignKey(c => c.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        // Comentario → Filme (muitos-para-um)
        model.Entity<Comentario>()
            .HasOne(c => c.Filme)
            .WithMany(f => f.Comentarios)    
            .HasForeignKey(c => c.FilmeId)
            .OnDelete(DeleteBehavior.Cascade);

        // Assinatura → Usuario (muitos-para-um)
        model.Entity<Assinatura>()
            .HasOne(a => a.Usuario)
            .WithMany(u => u.Assinaturas)
            .HasForeignKey(a => a.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);


        base.OnModelCreating(model);
    }
}
