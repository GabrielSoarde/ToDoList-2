using System.Collections.Generic;
using System.Threading.Tasks;
using ToDoList.Api.Models;

namespace ToDoList.Api.Services
{
    public interface IToDoService
    {
        Task<IEnumerable<ToDoItem>> GetAllForUser(string userId);
        Task<ToDoItem?> GetById(int id);
        Task<ToDoItem?> GetByIdForUser(int id, string userId);
        Task<ToDoItem> Create(ToDoItem item);
        Task<bool> Update(ToDoItem item);
        Task<bool> UpdateForUser(int id, string userId, ToDoList.Api.Models.Dtos.UpdateToDoItemDto dto);
        Task<bool> Delete(int id);
        Task<bool> DeleteForUser(int id, string userId);
    }
}