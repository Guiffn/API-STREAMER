using Streamer.Models;

public class Assinatura
    {
        public int Id { get; set; }

        // FK
        public int UsuarioId { get; set; }

        public DateTime DataInicio { get; set; }
        public DateTime DataFim    { get; set; }
        public bool Ativa          { get; set; }

        // Navegação
        public Usuario Usuario { get; set; } = null!;
    }
