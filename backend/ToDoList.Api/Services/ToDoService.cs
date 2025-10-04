using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using ToDoList.Api.Data;
using ToDoList.Api.Models;

namespace ToDoList.Api.Services
{
    public class ToDoService : IToDoService
    {
        private readonly ToDoListContext _context;

        public ToDoService(ToDoListContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ToDoItem>> GetAll()
        {
            return await _context.ToDoItems.ToListAsync();
        }

        public async Task<IEnumerable<ToDoItem>> GetAllForUser(string userId)
        {
            return await _context.ToDoItems
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }

        public async Task<ToDoItem?> GetById(int id)
        {
            return await _context.ToDoItems.FindAsync(id);
        }

        public async Task<ToDoItem?> GetByIdForUser(int id, string userId)
        {
            return await _context.ToDoItems
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        }

        public async Task<ToDoItem> Create(ToDoItem item)
        {
            _context.ToDoItems.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<bool> Update(ToDoItem item)
        {
            var exists = await _context.ToDoItems.AnyAsync(x => x.Id == item.Id);
            if (!exists) return false;

            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Delete(int id)
        {
            var item = await _context.ToDoItems.FindAsync(id);
            if (item == null) return false;

            _context.ToDoItems.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteForUser(int id, string userId)
        {
            var item = await _context.ToDoItems
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
            if (item == null) return false;

            _context.ToDoItems.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}