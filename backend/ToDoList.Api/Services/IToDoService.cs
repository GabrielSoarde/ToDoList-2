using System.Collections.Generic;
using System.Threading.Tasks;
using ToDoList.Api.Models;

namespace ToDoList.Api.Services
{
    public interface IToDoService
    {
        Task<IEnumerable<ToDoItem>> GetAll();
        Task<ToDoItem?> GetById(int id);
        Task<ToDoItem> Create(ToDoItem item);
        Task<bool> Update(ToDoItem item);
        Task<bool> Delete(int id);
    }
}