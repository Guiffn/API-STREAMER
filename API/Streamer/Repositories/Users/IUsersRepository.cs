using Streamer.Models;

namespace Streamer.Repositories.Users;

public interface IUsersRepository
{
    User? GetByEmail(string email);
    User? Get(int id);
    void Create(User user);
    void Update(User user);
    void Delete(int id);
    List<User> List();
}