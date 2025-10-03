namespace ToDoList.Api.Models.Dtos
{
    public class CreateToDoItemDto
    {
        public string Title { get; set; } = string.Empty;

        // Campos extras da versão 1.2
        public DateTime? DueDate { get; set; }
        public string? Priority { get; set; } // Alta, Média, Baixa
        public string? Category { get; set; }
    }
}