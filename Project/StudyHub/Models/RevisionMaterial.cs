namespace StudyHub.Models
{
    public class Material
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ContentOrUrl { get; set; } = string.Empty;
        public string MaterialType { get; set; } = string.Empty;
        
        // These are the keys to our new logic
        public string SchoolName { get; set; } = string.Empty; // e.g. School of Medicine
        public string CourseName { get; set; } = string.Empty; // e.g. Anatomy
        
        public int Year { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}