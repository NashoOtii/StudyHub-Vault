using Microsoft.AspNetCore.Mvc;
using StudyHub.Data;
using StudyHub.Models;

namespace StudyHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaterialsController : ControllerBase
    {
        private readonly StudyHubDbContext _context;

        public MaterialsController(StudyHubDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetMaterials([FromQuery] string school, [FromQuery] int year, [FromQuery] string? course)
        {
            var query = _context.Materials.Where(m => m.SchoolName == school && m.Year == year);

            if (!string.IsNullOrEmpty(course) && course != "All")
            {
                query = query.Where(m => m.CourseName == course);
            }

            return Ok(query.ToList());
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] MaterialUploadRequest request)
        {
            if (request.File == null) return BadRequest("No file uploaded.");

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
            if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(request.File.FileName);
            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await request.File.CopyToAsync(stream);
            }

            var material = new Material
            {
                Title = request.Title,
                ContentOrUrl = fileName,
                MaterialType = "PDF",
                SchoolName = request.SchoolName,
                CourseName = request.CourseName,
                Year = request.Year
            };

            _context.Materials.Add(material);
            await _context.SaveChangesAsync();

            return Ok(material);
        }
    }

    public class MaterialUploadRequest
    {
        public string Title { get; set; } = string.Empty;
        public IFormFile? File { get; set; }
        public string SchoolName { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
        public int Year { get; set; }
    }
}