using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Streamer.Models;

    public class Usuario
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório.")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "Formato de e-mail inválido.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "A senha é obrigatória.")]
        public string Senha { get; set; } = string.Empty;

        public Permissao Permissao { get; set; } = Permissao.Usuario;

        public List<int> Favoritos { get; set; } = new();

        // Navegação
        public List<Comentario> Comentarios { get; set; } = new();
        public List<Filme> Filmes { get; set; } = new();
        public List<Assinatura> Assinaturas { get; set; } = new();
    }