using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using ToDoList.Api.Data;
using ToDoList.Api.Models;
using ToDoList.Api.Models.Dtos;

namespace ToDoList.Api.Services
{
    public class ToDoService : IToDoService
    {
        private readonly ToDoListContext _context;

        public ToDoService(ToDoListContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ToDoItem>> GetAllForUser(string userId)
        {
            var tasks = await _context.ToDoItems
                .Where(x => x.UserId == userId)
                .ToListAsync();

            // Mapeia a prioridade para um valor numérico para ordenação
            int GetPriorityValue(string? priority) => priority switch
            {
                "Alta" => 3,
                "Média" => 2,
                "Baixa" => 1,
                _ => 0
            };

            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            // Ordena as tarefas com a lógica correta e simplificada
            var sortedTasks = tasks
                // 1. Tarefas concluídas vão para o final
                .OrderBy(t => t.IsComplete)
                // 2. Ordena pela data de vencimento (as mais próximas primeiro, tarefas sem data ficam por último)
                .ThenBy(t => t.DueDate.HasValue ? t.DueDate.Value : DateOnly.MaxValue)
                // 3. Como desempate, ordena pela prioridade (as mais altas primeiro)
                .ThenByDescending(t => GetPriorityValue(t.Priority))
                .ToList();

            return sortedTasks;
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

        public async Task<bool> UpdateForUser(int id, string userId, UpdateToDoItemDto dto)
        {
            var existingItem = await GetByIdForUser(id, userId);
            if (existingItem == null)
            {
                return false;
            }

            // Apply updates from DTO
            if (!string.IsNullOrWhiteSpace(dto.Title))
            {
                existingItem.Title = dto.Title;
            }

            if (dto.IsComplete.HasValue)
            {
                existingItem.IsComplete = dto.IsComplete.Value;
            }

            existingItem.DueDate = dto.DueDate;
            existingItem.Priority = string.IsNullOrWhiteSpace(dto.Priority) ? existingItem.Priority : dto.Priority;
            existingItem.Category = string.IsNullOrWhiteSpace(dto.Category) ? existingItem.Category : dto.Category;

            // Save changes
            _context.Entry(existingItem).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}