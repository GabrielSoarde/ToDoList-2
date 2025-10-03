using Microsoft.AspNetCore.Mvc;
using ToDoList.Api.Models;
using ToDoList.Api.Services;
using Microsoft.AspNetCore.Authorization; 
using System.Collections.Generic;
using System.Threading.Tasks;
using ToDoList.Api.Models.Dtos; // ESSENCIAL para usar async/await

namespace ToDoList.Api.Controllers
{
    // A proteção [Authorize] garante que SÓ usuários com um JWT válido acessem.
    [Authorize] 
    [ApiController]
    [Route("api/[controller]")]
    public class ToDoItemsController : ControllerBase
    {
        private readonly IToDoService _toDoService; 

        public ToDoItemsController(IToDoService toDoService)
        {
            _toDoService = toDoService;
        }

        // GET: api/ToDoItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ToDoItem>>> GetToDoItems() // Corrigido
        {
            // Chamada assíncrona
            return Ok(await _toDoService.GetAll());
        }

        // GET: api/ToDoItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ToDoItem>> GetToDoItem(int id) // Corrigido
        {
            // Chamada assíncrona
            var item = await _toDoService.GetById(id); 

            if (item == null)
            {
                return NotFound();
            }

            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<ToDoItemDto>> Create(CreateToDoItemDto dto)
        {
            var item = new ToDoItem
            {
                Title = dto.Title,
                Description = dto.Description,
                DueDate = dto.DueDate,
                Priority = dto.Priority,
                Category = dto.Category,
                UserId = User.Identity?.Name
            };

            var createdItem = await _toDoService.Create(item);

            return CreatedAtAction(nameof(GetToDoItem), new { id = createdItem.Id }, new ToDoItemDto
            {
                Id = createdItem.Id,
                Title = createdItem.Title,
                Description = createdItem.Description,
                IsComplete = createdItem.IsComplete,
                CreatedAt = createdItem.CreatedAt,
                DueDate = createdItem.DueDate,
                Priority = createdItem.Priority,
                Category = createdItem.Category
            });
        }

        // PUT: api/ToDoItems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutToDoItem(int id, UpdateToDoItemDto dto)
        {
            var existingItem = await _toDoService.GetById(id);
            if (existingItem == null)
                return NotFound();

            // Atualiza os campos editáveis
            if (!string.IsNullOrWhiteSpace(dto.Title))
                existingItem.Title = dto.Title;

            if (dto.IsComplete.HasValue)
                existingItem.IsComplete = dto.IsComplete.Value;

            existingItem.DueDate = dto.DueDate;
            existingItem.Priority = string.IsNullOrWhiteSpace(dto.Priority) ? existingItem.Priority : dto.Priority;
            existingItem.Category = string.IsNullOrWhiteSpace(dto.Category) ? existingItem.Category : dto.Category;

            var updated = await _toDoService.Update(existingItem);

            if (!updated)
                return BadRequest();

            return NoContent();
        }

        // DELETE: api/ToDoItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteToDoItem(int id) // Corrigido
        {

            if (!await _toDoService.Delete(id))
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}