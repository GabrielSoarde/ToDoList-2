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
                IsComplete = createdItem.IsComplete,
                CreatedAt = createdItem.CreatedAt,
                DueDate = createdItem.DueDate,
                Priority = createdItem.Priority,
                Category = createdItem.Category
            });
        }

        // PUT: api/ToDoItems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutToDoItem(int id, ToDoItem toDoItem) // Corrigido
        {
            if (id != toDoItem.Id)
            {
                return BadRequest();
            }

            // Chamada assíncrona com await
            if (!await _toDoService.Update(toDoItem)) 
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/ToDoItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteToDoItem(int id) // Corrigido
        {
            // Chamada assíncrona com await
            if (!await _toDoService.Delete(id))
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}