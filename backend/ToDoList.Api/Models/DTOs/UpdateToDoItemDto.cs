namespace ToDoList.Api.Models.Dtos
{
    public class UpdateToDoItemDto
    {
        public string Title { get; set; } = string.Empty;
        public bool? IsComplete { get; set; }

        // Campos extras
        public DateTime? DueDateTime { get; set; }
        public string? Priority { get; set; }
        public string? Category { get; set; }
    }
}