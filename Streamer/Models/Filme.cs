using System.Text.Json.Serialization;  
using System.ComponentModel.DataAnnotations;
using Streamer.Models;  

public class Filme
{
    public int Id { get; set; }

    [Required(ErrorMessage = "O nome é obrigatório.")]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "A descrição é obrigatória.")]
    public string Descricao { get; set; } = string.Empty;

    [Required(ErrorMessage = "O CategoriaId é obrigatório.")]
    public int CategoriaId { get; set; }

    [JsonIgnore]            
    public Categoria? Categoria { get; set; }

    [Required(ErrorMessage = "O link do vídeo é obrigatório.")]
    public string LinkVideo { get; set; } = string.Empty;
 
    [JsonIgnore]
    public List<Comentario> Comentarios { get; set; } = new();
}
