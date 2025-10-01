// Define a estrutura de um item da lista de tarefas
export interface ToDoItem {
  id: number;
  title: string;
  isComplete: boolean;
  createdAt: Date;
}