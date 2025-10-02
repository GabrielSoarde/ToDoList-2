    namespace ToDoList.Api.Models
    {
        public class ToDoItem
        {
            public int Id { get; set; }

            // Nova propriedade para identificar o usuário
            public string? UserId { get; set; } 

            public string? Title { get; set; }
            public bool IsComplete { get; set; }
            public DateTime CreatedAt { get; set; } = DateTime.Now;
        }
    }