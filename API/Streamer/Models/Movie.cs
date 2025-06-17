using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Streamer.Models;

public class Movie
{
    public int Id { get; set; }
    
    [Required]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    public int CategoryId { get; set; }
    
    [JsonIgnore]
    public Category? Category { get; set; }
    
    public int UserId { get; set; }
    
    [JsonIgnore]
    public User? User { get; set; }
}
