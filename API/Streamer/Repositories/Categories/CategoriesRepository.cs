using Microsoft.EntityFrameworkCore;
using Streamer.Data;
using Streamer.Models;

namespace Streamer.Repositories.Categories;

public class CategoriesRepository : ICategoriesRepository
{
    private readonly StreamerContext _context;

    public CategoriesRepository(StreamerContext context)
    {
        _context = context;
    }

    public Category? Get(int id)
    {
        return _context.Categories.Find(id);
    }

    public void Create(Category category)
    {
        _context.Categories.Add(category);
        _context.SaveChanges();
    }

    public void Update(Category category)
    {
        _context.Categories.Update(category);
        _context.SaveChanges();
    }

    public void Delete(int id)
    {
        var category = _context.Categories.Find(id);
        if (category != null)
        {
            _context.Categories.Remove(category);
            _context.SaveChanges();
        }
    }

    public List<Category> List()
    {
        return _context.Categories.ToList();
    }
} 