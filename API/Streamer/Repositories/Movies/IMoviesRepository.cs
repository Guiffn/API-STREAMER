using Streamer.Models;

namespace Streamer.Repositories.Movies;

public interface IMoviesRepository
{
    Movie? Get(int id);
    void Create(Movie movie);
    void Update(Movie movie);
    void Delete(int id);
    List<Movie> List();
    List<Movie> ListByUser(int userId);
}