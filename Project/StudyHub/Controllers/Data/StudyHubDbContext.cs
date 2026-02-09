using Microsoft.EntityFrameworkCore;
using StudyHub.Models;

namespace StudyHub.Data
{
    public class StudyHubDbContext : DbContext
    {
        public StudyHubDbContext(DbContextOptions<StudyHubDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        
        // FIX: Ensure this says <Material> and Materials
        public DbSet<Material> Materials { get; set; } 
    }
}