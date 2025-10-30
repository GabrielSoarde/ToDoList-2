namespace ToDoList.Api.Models.Dtos
{
    public class CreateToDoItemDto
    {
        public string Title { get; set; }
        
        public string? Description { get; set; }
        public DateTime? DueDateTime { get; set; }
        public string? Priority { get; set; }
        public string? Category { get; set; }
    }
}