using ToDoList.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks; // ESSENCIAL para assincronicidade

namespace ToDoList.Api.Services
{
    public interface IToDoService
    {
        // Retorna todos os itens (assíncrono, sem userId)
        Task<IEnumerable<ToDoItem>> GetAll();

        // Retorna um item por ID (assíncrono, sem userId)
        Task<ToDoItem?> GetById(int id);

        // Adiciona um novo item (assíncrono, sem userId)
        Task<ToDoItem> Add(ToDoItem newItem);

        // Atualiza um item (assíncrono, sem userId)
        Task<bool> Update(ToDoItem updatedItem);

        // Remove um item (assíncrono, sem userId)
        Task<bool> Delete(int id);
    }
}