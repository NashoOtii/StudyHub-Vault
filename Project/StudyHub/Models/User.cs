namespace StudyHub.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string SchoolName { get; set; } = string.Empty; // Selected from your dropdown
        public int Year { get; set; }
    }
}