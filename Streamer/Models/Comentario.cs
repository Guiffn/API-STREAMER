using System.ComponentModel.DataAnnotations;
using Streamer.Models;

 public class Comentario
    {
        public int Id { get; set; }

        // FKs
        public int UsuarioId { get; set; }
        public int FilmeId { get; set; }

        [Required(ErrorMessage = "O texto do comentário é obrigatório.")]
        public string Texto { get; set; } = string.Empty;

        public DateTime DataComentario { get; set; }

        // Navegação
        public Usuario Usuario { get; set; } = null!;
        public Filme Filme { get; set; } = null!;
    }