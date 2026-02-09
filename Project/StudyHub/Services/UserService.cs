using StudyHub.Data;
using StudyHub.Models;

namespace StudyHub.Services
{
    public class UserService
    {
        private readonly StudyHubDbContext _context;

        public UserService(StudyHubDbContext context)
        {
            _context = context;
        }

        public User? Authenticate(string email, string password)
        {
            // Now correctly finds the password property we added to the model
            return _context.Users.FirstOrDefault(u => u.Email == email && u.Password == password);
        }

        public User? GetUserByEmail(string email)
        {
            return _context.Users.FirstOrDefault(u => u.Email == email);
        }

        public User Register(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }
    }
}