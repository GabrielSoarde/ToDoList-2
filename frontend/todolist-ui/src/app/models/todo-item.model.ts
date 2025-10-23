export interface ToDoItem {
  id: number;
  title: string;
  isComplete: boolean;
  createdAt: string;
  dueDate?: string;
  priority?: 'Alta' | 'Média' | 'Baixa';
  category?: string;  
  description?: string;
}

export interface CreateToDoItemDto {
  title: string;
  description?: string;
  dueDate?: string | null;
  priority?: string | null;
  category?: string | null;
}
  