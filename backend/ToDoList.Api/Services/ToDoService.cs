using ToDoList.Api.Models;
using ToDoList.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks; // ESSENCIAL

namespace ToDoList.Api.Services
{
    public class ToDoService : IToDoService
    {
        private readonly ToDoListContext _context;
        private readonly string _currentUserId;

        public ToDoService(ToDoListContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _currentUserId = httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? 
                             throw new UnauthorizedAccessException("Usuário não autenticado.");
        }

        // READ (Todos) - Implementação Assíncrona
        public async Task<IEnumerable<ToDoItem>> GetAll()
        {
            return await _context.ToDoItems
                               .Where(t => t.UserId == _currentUserId)
                               .ToListAsync(); // <-- Usando ToListAsync()
        }

        // READ (Por ID)
        public async Task<ToDoItem?> GetById(int id)
        {
            return await _context.ToDoItems
                               .FirstOrDefaultAsync(t => t.Id == id && t.UserId == _currentUserId); // <-- Usando FirstOrDefaultAsync()
        }

        // CREATE
        public async Task<ToDoItem> Add(ToDoItem newItem)
        {
            newItem.CreatedAt = DateTime.Now;
            newItem.UserId = _currentUserId;
            
            _context.ToDoItems.Add(newItem);
            await _context.SaveChangesAsync(); // <-- Usando SaveChangesAsync()
            
            return newItem;
        }

        // UPDATE
        public async Task<bool> Update(ToDoItem updatedItem)
        {
            var existingItem = await GetById(updatedItem.Id); // Já usa o método assíncrono

            if (existingItem == null)
            {
                return false; 
            }

            existingItem.Title = updatedItem.Title;
            existingItem.IsComplete = updatedItem.IsComplete;
            
            await _context.SaveChangesAsync(); // <-- Usando SaveChangesAsync()

            return true;
        }

        // DELETE
        public async Task<bool> Delete(int id)
        {
            var itemToRemove = await GetById(id); // Já usa o método assíncrono
            
            if (itemToRemove == null)
            {
                return false;
            }

            _context.ToDoItems.Remove(itemToRemove);
            await _context.SaveChangesAsync(); // <-- Usando SaveChangesAsync()
            
            return true;
        }
    }
}