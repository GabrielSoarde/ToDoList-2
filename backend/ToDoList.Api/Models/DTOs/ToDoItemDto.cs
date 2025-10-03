namespace ToDoList.Api.Models.Dtos
{
    public class ToDoItemDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsComplete { get; set; }
        public DateTime CreatedAt { get; set; }

        // Extras
        public DateTime? DueDate { get; set; }
        public string? Priority { get; set; }
        public string? Category { get; set; }
    }
}