export interface Task {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
  dueDate?: string;              // Novo campo
  priority?: 'Alta' | 'Média' | 'Baixa'; // Novo campo
  category?: string;           // Novo campo
}
