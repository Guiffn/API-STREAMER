using Streamer.Models;

namespace Streamer.Repositories.Categories;

public interface ICategoriesRepository
{
    Category? Get(int id);
    void Create(Category category);
    void Update(Category category);
    void Delete(int id);
    List<Category> List();
}