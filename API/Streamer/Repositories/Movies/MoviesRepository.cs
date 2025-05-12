using Microsoft.EntityFrameworkCore;
using Streamer.Data;
using Streamer.Models;

namespace Streamer.Repositories.Movies;

public class MoviesRepository : IMoviesRepository
{
    private readonly StreamerContext _context;

    public MoviesRepository(StreamerContext context)
    {
        _context = context;
    }

    public Movie? Get(int id)
    {
        return _context.Movies.Find(id);
    }

    public void Create(Movie movie)
    {
        _context.Movies.Add(movie);
        _context.SaveChanges();
    }

    public void Update(Movie movie)
    {
        _context.Movies.Update(movie);
        _context.SaveChanges();
    }

    public void Delete(int id)
    {
        var movie = _context.Movies.Find(id);
        if (movie != null)
        {
            _context.Movies.Remove(movie);
            _context.SaveChanges();
        }
    }

    public List<Movie> List()
    {
        return _context.Movies.ToList();
    }

    public List<Movie> ListByUser(int userId)
    {
        return _context.Movies.Where(m => m.UserId == userId).ToList();
    }
} 