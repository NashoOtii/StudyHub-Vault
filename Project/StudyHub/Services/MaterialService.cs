using StudyHub.Data;
using StudyHub.Models;

namespace StudyHub.Services
{
    public class MaterialService
    {
        private readonly StudyHubDbContext _context;

        public MaterialService(StudyHubDbContext context)
        {
            _context = context;
        }

        public List<Material> GetMaterialsBySchool(string school, int year)
        {
            return _context.Materials
                .Where(m => m.SchoolName == school && m.Year == year)
                .ToList();
        }

        public void AddMaterial(Material material)
        {
            _context.Materials.Add(material);
            _context.SaveChanges();
        }
    }
}