namespace ToDoList.Api.Models
{
    public class ToDoItem
    {
        public int Id { get; set; }

        // Identificador do usuário dono da tarefa
        public string UserId { get; set; } 

        public string Title { get; set; }
        public bool IsComplete { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // ================================
        // 🚀 NOVOS CAMPOS V1.2
        // ================================
        
        public DateTime? DueDate { get; set; }
        
        public string? Priority { get; set; }
        
        public string? Category { get; set; }
    }
}