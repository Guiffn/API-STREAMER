using System.ComponentModel.DataAnnotations;

namespace Streamer.Models;

public class Category
{
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; } = string.Empty;
    [Required]
    public string Description { get; set; } = string.Empty;
}
