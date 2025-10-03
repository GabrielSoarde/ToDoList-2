export interface Task {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
  dueDate?: Date;              // Novo campo
  priority?: 'Alta' | 'Média' | 'Baixa'; // Novo campo
  category?: string;           // Novo campo
}
