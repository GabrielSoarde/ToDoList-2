# Guidelines de Desenvolvimento

## Convenções de Código

### Backend (.NET C#)

#### Nomenclatura
- Classes: PascalCase (`ToDoService`, `ToDoItemController`)
- Métodos: PascalCase (`GetToDoItems`, `CreateToDoItem`)
- Variáveis: camelCase (`toDoService`, `itemList`)
- Constantes: PascalCase (`MaxItemsPerUser`)
- Interfaces: Prefixo "I" (`IToDoService`)

#### Estrutura de Código
- Um arquivo por classe quando possível
- Métodos devem ter no máximo 50 linhas
- Classes devem ter responsabilidade única
- Utilizar regions para agrupar métodos relacionados

#### Comentários
- Comentar apenas o necessário
- Explicar decisões complexas
- Utilizar XML documentation para métodos públicos
- Manter comentários atualizados com o código

#### Exemplo de Estrutura

```csharp
/// <summary>
/// Serviço para gerenciar itens da lista de tarefas
/// </summary>
public class ToDoService : IToDoService
{
    private readonly ToDoListContext _context;

    public ToDoService(ToDoListContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retorna todos os itens de tarefa para um usuário específico
    /// </summary>
    /// <param name="userId">ID do usuário</param>
    /// <returns>Lista de itens de tarefa</returns>
    public async Task<IEnumerable<ToDoItem>> GetAllForUser(string userId)
    {
        return await _context.ToDoItems
            .Where(x => x.UserId == userId)
            .ToListAsync();
    }
}
```

### Frontend (Angular TypeScript)

#### Nomenclatura
- Classes e Interfaces: PascalCase (`ToDoService`, `ToDoItem`)
- Métodos e Variáveis: camelCase (`getToDoItems`, `itemList`)
- Constantes: UPPER_SNAKE_CASE (`MAX_ITEMS_PER_USER`)
- Componentes: Kebab-case nos nomes de arquivos (`todo-list.component.ts`)

#### Estrutura de Código
- Componentes pequenos e focados em uma única responsabilidade
- Métodos devem ter no máximo 30 linhas
- Utilizar services para lógica compartilhada
- Preferir signals a observables para estado local

#### Exemplo de Estrutura

```typescript
import { Component, signal } from '@angular/core';
import { ToDoService } from '../services/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html'
})
export class ToDoListComponent {
  tasks = signal<ToDoItem[]>([]);

  constructor(private toDoService: ToDoService) {}

  loadTasks(): void {
    this.toDoService.getAll().subscribe({
      next: (loadedTasks) => this.tasks.set(loadedTasks),
      error: (err) => console.error('Erro ao carregar tarefas:', err)
    });
  }
}
```

## Práticas de Desenvolvimento

### Git
- Branches com nomes descritivos (ex: `feature/user-authentication`, `bugfix/login-error`)
- Commits atômicos e bem descritos
- Usar convenções de commit semântico (ex: `feat:`, `fix:`, `docs:`, `refactor:`)

### Testes
- Escrever testes unitários para lógica de negócios
- Cobertura mínima de 80% para componentes críticos
- Testes de integração para endpoints da API

### Segurança
- Validar sempre inputs do usuário
- Utilizar parametrização para consultas ao banco
- Proteger endpoints sensíveis com `[Authorize]`
- Nunca armazenar senhas ou chaves em arquivos de configuração

### Performance
- Utilizar métodos assíncronos (async/await) para operações I/O
- Implementar paginação para listas grandes
- Utilizar lazy loading para módulos/componentes
- Evitar operações pesadas na thread principal

## Práticas de Código Limpo

### Backend
```csharp
// Ruim
public async Task<bool> Update(int id, string title, bool? isComplete, string priority, string category)
{
    var item = await _context.ToDoItems.FindAsync(id);
    if(item == null) return false;
    item.Title = title;
    if(isComplete.HasValue) item.IsComplete = isComplete.Value;
    item.Priority = priority;
    item.Category = category;
    await _context.SaveChangesAsync();
    return true;
}

// Bom
public async Task<bool> Update(ToDoItem item)
{
    var existingItem = await GetByIdForUser(item.Id, item.UserId);
    if(existingItem == null) return false;

    UpdateItemProperties(existingItem, item);
    await _context.SaveChangesAsync();
    return true;
}

private void UpdateItemProperties(ToDoItem existingItem, ToDoItem updatedItem)
{
    existingItem.Title = updatedItem.Title;
    existingItem.IsComplete = updatedItem.IsComplete;
    existingItem.Priority = updatedItem.Priority;
    existingItem.Category = updatedItem.Category;
    existingItem.DueDate = updatedItem.DueDate;
}
```

### Frontend
```typescript
// Ruim
updateTask(task: ToDoItem) {
  this.http.put(`${this.apiUrl}/${task.id}`, {
    title: task.title,
    isComplete: task.isComplete,
    priority: task.priority,
    category: task.category
  }).subscribe(response => {
    // Atualizar lista local
    const index = this.tasks().findIndex(t => t.id === task.id);
    if (index !== -1) {
      const updatedTasks = [...this.tasks()];
      updatedTasks[index] = {...response};
      this.tasks.set(updatedTasks);
    }
  });
}

// Bom
updateTask(task: ToDoItem): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/${task.id}`, this.mapTaskToUpdateDto(task));
}

private mapTaskToUpdateDto(task: ToDoItem): UpdateTaskDto {
  return {
    title: task.title,
    isComplete: task.isComplete,
    priority: task.priority,
    category: task.category,
    dueDate: task.dueDate
  };
}
```

## Convenções de API

### Nomenclatura de Endpoints
- Utilizar substantivos no plural (ex: `/api/todolists`, `/api/users`)
- Utilizar HTTP verbs corretamente (GET, POST, PUT, DELETE)
- Utilizar nomes descritivos para ações personalizadas (ex: `/api/todolists/mark-complete`)

### Respostas de API
- Utilizar códigos de status HTTP apropriados
- Retornar JSON consistentemente
- Incluir mensagens de erro descritivas

### Exemplo de Endpoint
```csharp
[HttpGet]
[ProducesResponseType(typeof(IEnumerable<ToDoItem>), 200)]
[ProducesResponseType(401)]
public async Task<ActionResult<IEnumerable<ToDoItem>>> GetToDoItems()
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(userId))
        return Unauthorized();

    var items = await _toDoService.GetAllForUser(userId);
    return Ok(items);
}
```

## Convenções de Frontend

### Componentes
- Componentes devem ter no máximo 300 linhas
- Separar template, estilo e lógica em arquivos diferentes
- Utilizar OnPush change detection quando apropriado

### Serviços
- Serviços devem ser injetáveis e reutilizáveis
- Lógica de negócios deve estar nos serviços, não nos componentes
- Tratar erros de forma consistente

### Formulários
- Utilizar Reactive Forms para validação complexa
- Exibir feedback visual para erros de validação
- Implementar loading states para operações assíncronas