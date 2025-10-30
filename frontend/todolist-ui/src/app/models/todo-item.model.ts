export interface ToDoItem {
  id: number;
  title: string;
  isComplete: boolean;
  createdAt: string;
  dueDateTime?: string;
  priority?: 'Alta' | 'Média' | 'Baixa';
  category?: string;  
  description?: string;
}

export interface CreateToDoItemDto {
  title: string;
  description?: string;
  dueDateTime?: string | null;
  priority?: string | null;
  category?: string | null;
}

export interface UpdateToDoItemDto {
  title?: string;
  isComplete?: boolean;
  dueDateTime?: string | null;
  priority?: string | null;
  category?: string | null;
}
  