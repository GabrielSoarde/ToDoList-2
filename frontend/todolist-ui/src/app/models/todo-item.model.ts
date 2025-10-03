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
  