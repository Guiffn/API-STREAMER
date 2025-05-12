using Microsoft.EntityFrameworkCore;
using Streamer.Data;
using Streamer.Models;

namespace Streamer.Repositories.Users;

public class UsersRepository : IUsersRepository
{
    private readonly StreamerContext _context;

    public UsersRepository(StreamerContext context)
    {
        _context = context;
    }

    public User? GetByEmail(string email)
    {
        return _context.Users.FirstOrDefault(u => u.Email.ToLower() == email.ToLower());
    }

    public User? Get(int id)
    {
        return _context.Users.Find(id);
    }

    public void Create(User user)
    {
        _context.Users.Add(user);
        _context.SaveChanges();
    }

    public void Update(User user)
    {
        _context.Users.Update(user);
        _context.SaveChanges();
    }

    public void Delete(int id)
    {
        var user = _context.Users.Find(id);
        if (user != null)
        {
            _context.Users.Remove(user);
            _context.SaveChanges();
        }
    }

    public List<User> List()
    {
        return _context.Users.ToList();
    }
} 