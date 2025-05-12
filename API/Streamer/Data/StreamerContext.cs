using Microsoft.EntityFrameworkCore;
using Streamer.Models;

namespace Streamer.Data;

public class StreamerContext : DbContext
{
    public StreamerContext(DbContextOptions<StreamerContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Movie> Movies { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasKey(u => u.Id);

        modelBuilder.Entity<User>()
            .Property(u => u.Email)
            .IsRequired();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Category>()
            .HasKey(c => c.Id);

        modelBuilder.Entity<Category>()
            .Property(c => c.Name)
            .IsRequired();

        modelBuilder.Entity<Category>()
            .HasIndex(c => c.Name)
            .IsUnique();

        modelBuilder.Entity<Movie>()
            .HasKey(m => m.Id);

        modelBuilder.Entity<Movie>()
            .HasIndex(m => m.Title)
            .IsUnique();
        
        modelBuilder.Entity<Movie>()
            .HasOne(m => m.Category)
            .WithMany()
            .HasForeignKey(m => m.CategoryId);        
    }
} 