using Microsoft.AspNetCore.Mvc;
using ToDoList.Api.Models;
using ToDoList.Api.Services;
using Microsoft.AspNetCore.Authorization; 
using System.Collections.Generic;
using System.Threading.Tasks;
using ToDoList.Api.Models.Dtos; // ESSENCIAL para usar async/await
using System.Security.Claims; // Adicionado para ClaimTypes

namespace ToDoList.Api.Controllers
{
    // A proteção [Authorize] garante que SÓ usuários com um JWT válido acessem.
    [Authorize] 
    [ApiController]
    [Route("api/[controller]")]
    public class ToDoItemsController : ControllerBase
    {
        private readonly IToDoService _toDoService;
        private readonly ILogger<ToDoItemsController> _logger; // Adicionado

        public ToDoItemsController(IToDoService toDoService, ILogger<ToDoItemsController> logger) // Adicionado
        {
            _toDoService = toDoService;
            _logger = logger; // Adicionado
        }

        // GET: api/ToDoItems - Retorna apenas as tarefas do usuário autenticado
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ToDoItem>>> GetToDoItems() // Corrigido
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            // Retorna apenas as tarefas do usuário autenticado
            return Ok(await _toDoService.GetAllForUser(userId));
        }

        // GET: api/ToDoItems/5 - Retorna apenas a tarefa se pertencer ao usuário autenticado
        [HttpGet("{id}")]
        public async Task<ActionResult<ToDoItem>> GetToDoItem(int id) // Corrigido
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            // Busca a tarefa apenas se pertencer ao usuário autenticado
            var item = await _toDoService.GetByIdForUser(id, userId); 

            if (item == null)
            {
                return NotFound();
            }

            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<ToDoItemDto>> Create(CreateToDoItemDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(); // Não deveria acontecer se [Authorize] estiver funcionando
            }

            var item = new ToDoItem
            {
                Title = dto.Title,
                Description = dto.Description,
                DueDateTime = dto.DueDateTime,
                Priority = dto.Priority,
                Category = dto.Category,
                UserId = userId // Corrigido para usar o ID do usuário
            };

            var createdItem = await _toDoService.Create(item);

            // Log da criação da tarefa
            _logger.LogInformation("New task created. TaskId: {TaskId}, UserId: {UserId}", createdItem.Id, userId);

            return CreatedAtAction(nameof(GetToDoItem), new { id = createdItem.Id }, new ToDoItemDto
            {
                Id = createdItem.Id,
                Title = createdItem.Title,
                Description = createdItem.Description,
                IsComplete = createdItem.IsComplete,
                CreatedAt = createdItem.CreatedAt,
                DueDateTime = createdItem.DueDateTime,
                Priority = createdItem.Priority,
                Category = createdItem.Category
            });
        }

        // PUT: api/ToDoItems/5 - Atualiza apenas a tarefa se pertencer ao usuário autenticado
        [HttpPut("{id}")]
        public async Task<IActionResult> PutToDoItem(int id, UpdateToDoItemDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var success = await _toDoService.UpdateForUser(id, userId, dto);

            if (!success)
            {
                return NotFound(); // Or BadRequest, depending on what failure means. NotFound is better if the item didn't exist.
            }

            return NoContent();
        }

        // DELETE: api/ToDoItems/5 - Deleta apenas a tarefa se pertencer ao usuário autenticado
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteToDoItem(int id) // Corrigido
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _toDoService.DeleteForUser(id, userId);
            
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}