namespace StudyHub.Models
{
    public class Unit
    {
        public int Id { get; set; }
        public required string Code { get; set; } 
        public required string Name { get; set; }
        public int? SchoolId { get; set; } 
        public int YearOfStudy { get; set; }
    }
}