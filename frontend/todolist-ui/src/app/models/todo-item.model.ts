// Define a estrutura de um item da lista de tarefas
export interface ToDoItem {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
  createdAt: Date;
}